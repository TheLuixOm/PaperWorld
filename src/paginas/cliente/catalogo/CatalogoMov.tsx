import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UsuarioMenu from '../../empleado/Barras/UsuarioMenu';
import MenuLateralMovil from '../componentes/MenuLateralMovil';
import ProductoExpandidoMov, { type ProductoExpandidoMovData } from '../componentes/ProductoExpandidoMov';
import clipAzul from '../../../images/Clip_azul.svg';
import reactLogo from '../../../assets/react.svg';
import '../inicio/InicioClienteMov.css';
import './CatalogoMov.css';

type ProductoMovil = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioAnterior?: number;
  tag?: 'Special' | 'Xpress';
  imagen: string;
  descuentoTexto?: string;
};

const productosBase: ProductoMovil[] = [
  {
    id: 'm-1',
    nombre: 'Un producto bla bla bla muy',
    descripcion: 'Un producto bla bla bla muy',
    precio: 7.66,
    precioAnterior: 0,
    tag: 'Special',
    imagen: reactLogo,
    descuentoTexto: '30% off',
  },
  {
    id: 'm-2',
    nombre: 'Un producto bla bla bla muy',
    descripcion: 'Un producto bla bla bla muy',
    precio: 7.66,
    precioAnterior: 0,
    tag: undefined,
    imagen: reactLogo,
    descuentoTexto: '30% off',
  },
  {
    id: 'm-3',
    nombre: 'Un producto bla bla bla muy',
    descripcion: 'Un producto bla bla bla muy',
    precio: 7.66,
    precioAnterior: 0,
    tag: 'Xpress',
    imagen: reactLogo,
    descuentoTexto: '30% off',
  },
  {
    id: 'm-4',
    nombre: 'Un producto bla bla bla muy',
    descripcion: 'Un producto bla bla bla muy',
    precio: 7.66,
    precioAnterior: 0,
    tag: undefined,
    imagen: reactLogo,
    descuentoTexto: '30% off',
  },
];

function IconoHamburguesa() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function IconoLupa() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.2 16.2 21 21" />
    </svg>
  );
}

function IconoCarrito() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <circle cx="9" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
      <path d="M3 5h2l2.2 9.2h10.4l2-6.5H6.1" />
    </svg>
  );
}

function IconoCatalogo() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M6 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2z" />
      <path d="M6 20h14" />
      <path d="M9 8h8" />
      <path d="M9 12h8" />
    </svg>
  );
}

function IconoInicio() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v11h14V10" />
    </svg>
  );
}

function IconoFiltro() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function IconoOrdenar() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M8 6h13" />
      <path d="M8 12h10" />
      <path d="M8 18h7" />
      <path d="M3 7l2-2 2 2" />
      <path d="M5 5v14" />
    </svg>
  );
}

function IconoCorazon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 20s-7-4.4-9.3-8.7C1 7.9 3.3 5 6.6 5c1.9 0 3.4 1 4.4 2.3C12 6 13.5 5 15.4 5c3.3 0 5.6 2.9 3.9 6.3C19 15.6 12 20 12 20z" />
    </svg>
  );
}

function CatalogoMov() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});
  const [productoExpandido, setProductoExpandido] = useState<ProductoExpandidoMovData | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [offsetFab, setOffsetFab] = useState(16);

  const productos = useMemo(
    () => [...productosBase, ...productosBase.map((p) => ({ ...p, id: `${p.id}-b` }))],
    [],
  );

  useEffect(() => {
    let frame = 0;

    const actualizar = () => {
      frame = 0;
      const footer = footerRef.current;
      if (!footer) {
        setOffsetFab(16);
        return;
      }

      const rect = footer.getBoundingClientRect();
      const viewportH = window.innerHeight || 0;
      const base = 16;
      const invade = Math.max(0, viewportH - rect.top);
      setOffsetFab(Math.round(base + invade));
    };

    const alScroll = () => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(actualizar);
    };

    actualizar();
    window.addEventListener('scroll', alScroll, { passive: true });
    window.addEventListener('resize', alScroll);

    return () => {
      window.removeEventListener('scroll', alScroll);
      window.removeEventListener('resize', alScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const abrirProducto = (producto: ProductoMovil) => {
    setProductoExpandido({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen: producto.imagen,
    });
  };

  return (
    <div className="inicioClienteMov catalogoMov" id="catalogo-cliente-mov">
      <ProductoExpandidoMov
        abierto={!!productoExpandido}
        producto={productoExpandido}
        alCerrar={() => setProductoExpandido(null)}
      />
      <MenuLateralMovil abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />

      <header className="inicioClienteMovHeader">
        <div className="inicioClienteMovTop">
          <button
            type="button"
            className="inicioClienteMovHamb"
            aria-label="Abrir menu"
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto(true)}
          >
            <IconoHamburguesa />
          </button>

          <div className="inicioClienteMovMarca" aria-label="Paper world">
            <img className="inicioClienteMovMarcaIcono" src={clipAzul} alt="Clip" />
            <span className="inicioClienteMovMarcaTexto">Paper world</span>
          </div>

          <div className="inicioClienteMovAcciones">
            <UsuarioMenu className="clienteUsuarioMenuMov" ariaLabel="Menu de usuario" />

            <Link to="/cliente/carrito" className="inicioClienteMovCarrito" aria-label="Carrito">
              <IconoCarrito />
              <span className="inicioClienteMovCarritoBadge" aria-label="Productos en carrito">
                0
              </span>
            </Link>

            <p className="inicioClienteMovTotal" aria-label="Total del carrito">
              AED 0.00
            </p>
          </div>
        </div>

        <nav className="inicioClienteMovNav" aria-label="Navegacion">
          <NavLink
            to="/cliente/catalogo"
            end
            className={({ isActive }) =>
              `inicioClienteMovNavItem ${isActive ? 'inicioClienteMovNavItemActivo' : ''}`
            }
          >
            <span className="inicioClienteMovNavIcon" aria-hidden="true">
              <IconoCatalogo />
            </span>
            <span className="inicioClienteMovNavText">Catalogo</span>
          </NavLink>

          <NavLink
            to="/cliente/inicio"
            className={({ isActive }) =>
              `inicioClienteMovNavItem ${isActive ? 'inicioClienteMovNavItemActivo' : ''}`
            }
          >
            <span className="inicioClienteMovNavIcon" aria-hidden="true">
              <IconoInicio />
            </span>
            <span className="inicioClienteMovNavText">Inicio</span>
          </NavLink>
        </nav>
      </header>

      <main className="inicioClienteMovMain">
        <section className="inicioClienteMovHero" aria-label="Presentacion">
          <div className="inicioClienteMovHeroMarco">
            <p className="inicioClienteMovHeroKicker">TODO lo que necesitas</p>
            <p className="inicioClienteMovHeroSubkicker">— en un solo lugar —</p>
            <h2 className="inicioClienteMovHeroTitulo" aria-label="PaperWorld">
              Paper<span>World</span>
            </h2>

            <div className="inicioClienteMovHeroCategorias" aria-label="Categorias">
              <div className="inicioClienteMovHeroCategoria">Utiles Escolares</div>
              <div className="inicioClienteMovHeroCategoria">Oficina</div>
              <div className="inicioClienteMovHeroCategoria">Papeleria</div>
              <div className="inicioClienteMovHeroCategoria">Regalos</div>
            </div>

            <p className="inicioClienteMovHeroPie">Variedad y calidad en todas nuestras categorias</p>
          </div>
        </section>

        <section className="inicioClienteMovBusqueda" aria-label="Buscar">
          <span className="inicioClienteMovBusquedaIcono" aria-hidden="true">
            <IconoLupa />
          </span>
          <input
            className="inicioClienteMovBusquedaInput"
            type="search"
            placeholder="Buscar producto"
            aria-label="Buscar producto"
          />
        </section>

        <section className="catalogoMovControles" aria-label="Controles">
          <button type="button" className="catalogoMovControl">
            <span className="catalogoMovControlIcono" aria-hidden="true">
              <IconoFiltro />
            </span>
            <span>Filtrar</span>
          </button>
          <button type="button" className="catalogoMovControl">
            <span className="catalogoMovControlIcono" aria-hidden="true">
              <IconoOrdenar />
            </span>
            <span>Ordenar</span>
          </button>
        </section>

        <section className="catalogoMovGrid" aria-label="Productos" role="list">
          {productos.map((producto) => (
            <article
              key={producto.id}
              className="catalogoMovCard"
              role="listitem"
              onClick={() => abrirProducto(producto)}
            >
              <div className="catalogoMovCardMarco">
                {producto.tag && (
                  <span
                    className={`catalogoMovTag ${
                      producto.tag === 'Special' ? 'catalogoMovTagSpecial' : 'catalogoMovTagXpress'
                    }`}
                  >
                    {producto.tag}
                  </span>
                )}

                <button
                  type="button"
                  className={`catalogoMovFav ${favoritos[producto.id] ? 'catalogoMovFavActiva' : ''}`}
                  aria-label="Favorito"
                  aria-pressed={!!favoritos[producto.id]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavoritos((prev) => ({ ...prev, [producto.id]: !prev[producto.id] }));
                  }}
                >
                  <IconoCorazon />
                </button>

                <div className="catalogoMovImagen">
                  <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                </div>

                <button
                  type="button"
                  className="catalogoMovMiniCarrito"
                  aria-label="Agregar al carrito"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconoCarrito />
                </button>
              </div>

              <div className="catalogoMovInfo">
                <p className="catalogoMovNombre">{producto.descripcion}</p>
                <p className="catalogoMovPrecio">
                  <span className="catalogoMovPrecioActual">AED {producto.precio.toFixed(2)}</span>
                </p>
                {producto.descuentoTexto && (
                  <p className="catalogoMovDescuento">
                    <span className="catalogoMovPrecioAnterior">0.00</span>
                    <span className="catalogoMovDescuentoTexto">({producto.descuentoTexto})</span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>

        <footer ref={footerRef} className="inicioClienteMovFooter" aria-label="Footer" />
      </main>

      <Link
        to="/cliente/carrito"
        className="catalogoMovFab"
        style={{ bottom: `${offsetFab}px` }}
        aria-label="Abrir carrito"
      >
        <span className="catalogoMovFabIcono" aria-hidden="true">
          <IconoCarrito />
        </span>
        <span className="catalogoMovFabPlus" aria-hidden="true">
          +
        </span>
      </Link>
    </div>
  );
}

export default CatalogoMov;

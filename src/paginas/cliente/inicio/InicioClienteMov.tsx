import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UsuarioMenu from '../../empleado/UsuarioMenu';
import MenuLateralMovil from '../componentes/MenuLateralMovil';
import ProductoExpandidoMov, { type ProductoExpandidoMovData } from '../componentes/ProductoExpandidoMov';
import clipAzul from '../../../images/Clip_azul.svg';
import reactLogo from '../../../assets/react.svg';
import './InicioClienteMov.css';

type ProductoMasVendido = {
  id: string;
  nombre: string;
  precio: number;
  precioAnterior?: number;
  descuento?: number;
  imagen: string;
};

const productosBase: ProductoMasVendido[] = [
  { id: 'p-1', nombre: 'PINCEL', precio: 120, precioAnterior: 160, descuento: 40, imagen: reactLogo },
  { id: 'p-2', nombre: 'brochas', precio: 375, precioAnterior: 400, descuento: 25, imagen: reactLogo },
  { id: 'p-3', nombre: 'brochas', precio: 375, precioAnterior: 400, descuento: 25, imagen: reactLogo },
  { id: 'p-4', nombre: 'Pinceles', precio: 960, precioAnterior: 1160, descuento: 35, imagen: reactLogo },
  { id: 'p-5', nombre: 'Brocha', precio: 370, precioAnterior: 400, descuento: 30, imagen: reactLogo },
  { id: 'p-6', nombre: 'combo', precio: 375, precioAnterior: 400, descuento: 25, imagen: reactLogo },
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

function IconoCorazon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 20s-7-4.4-9.3-8.7C1 7.9 3.3 5 6.6 5c1.9 0 3.4 1 4.4 2.3C12 6 13.5 5 15.4 5c3.3 0 5.6 2.9 3.9 6.3C19 15.6 12 20 12 20z" />
    </svg>
  );
}

function IconoOjo() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

function InicioClienteMov() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});
  const [productoExpandido, setProductoExpandido] = useState<ProductoExpandidoMovData | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [offsetFab, setOffsetFab] = useState(16);

  const productosMasVendidos = useMemo(
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

      // Si el footer entra en el viewport, empuja el FAB hacia arriba.
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

  const carruselRef = useRef<HTMLDivElement | null>(null);
  const arrastreRef = useRef<{ activo: boolean; x: number; scrollLeft: number; movio: boolean }>(
    { activo: false, x: 0, scrollLeft: 0, movio: false },
  );

  const alIniciarArrastre = (event: ReactPointerEvent<HTMLDivElement>) => {
    const contenedor = carruselRef.current;
    if (!contenedor) {
      return;
    }

    arrastreRef.current = { activo: true, x: event.clientX, scrollLeft: contenedor.scrollLeft, movio: false };
    contenedor.setPointerCapture(event.pointerId);
  };

  const alArrastrar = (event: ReactPointerEvent<HTMLDivElement>) => {
    const contenedor = carruselRef.current;
    if (!contenedor || !arrastreRef.current.activo) {
      return;
    }

    const delta = event.clientX - arrastreRef.current.x;
    if (Math.abs(delta) > 6) {
      arrastreRef.current.movio = true;
    }
    contenedor.scrollLeft = arrastreRef.current.scrollLeft - delta;
  };

  const alFinalizarArrastre = (event: ReactPointerEvent<HTMLDivElement>) => {
    const contenedor = carruselRef.current;
    if (!contenedor) {
      return;
    }

    arrastreRef.current.activo = false;
    try {
      contenedor.releasePointerCapture(event.pointerId);
    } catch {
      // noop
    }
  };

  const abrirProducto = (producto: ProductoMasVendido) => {
    if (arrastreRef.current.movio) {
      arrastreRef.current.movio = false;
      return;
    }

    setProductoExpandido({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    });
  };

  const desplazarCarrusel = (direccion: 'izquierda' | 'derecha') => {
    const contenedor = carruselRef.current;
    if (!contenedor) {
      return;
    }

    const paso = 210;
    const left = direccion === 'izquierda' ? -paso : paso;
    contenedor.scrollBy({ left, behavior: 'smooth' });
  };

  return (
    <div className="inicioClienteMov" id="inicio-cliente-mov">
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
            end
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

        <section className="inicioClienteMovSeccion" aria-label="Mas vendidos">
          <header className="inicioClienteMovSeccionEnc">
            <span className="inicioClienteMovEtiqueta">Este mes</span>
            <h3 className="inicioClienteMovTitulo">Mas Vendidos</h3>
          </header>

          <div className="inicioClienteMovCarrusel" aria-label="Carrusel">
            <div className="inicioClienteMovCarruselControles" aria-label="Controles">
              <button
                type="button"
                className="inicioClienteMovFlecha inicioClienteMovFlechaIzq"
                onClick={() => desplazarCarrusel('izquierda')}
                aria-label="Mover a la izquierda"
              >
                ‹
              </button>
              <button
                type="button"
                className="inicioClienteMovFlecha inicioClienteMovFlechaDer"
                onClick={() => desplazarCarrusel('derecha')}
                aria-label="Mover a la derecha"
              >
                ›
              </button>
            </div>

            <div
              className="inicioClienteMovCarruselLista"
              role="list"
              ref={carruselRef}
              onPointerDown={alIniciarArrastre}
              onPointerMove={alArrastrar}
              onPointerUp={alFinalizarArrastre}
              onPointerCancel={alFinalizarArrastre}
            >
              {productosMasVendidos.map((producto) => (
                <article
                  key={producto.id}
                  className="inicioClienteMovProducto"
                  role="listitem"
                  onClick={() => abrirProducto(producto)}
                >
                  <div
                    className="inicioClienteMovProductoMarco"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        abrirProducto(producto);
                      }
                    }}
                  >
                    {typeof producto.descuento === 'number' && (
                      <span className="inicioClienteMovProductoDescuento">-{producto.descuento}%</span>
                    )}

                    <div className="inicioClienteMovProductoAcciones" aria-label="Acciones">
                      <button
                        type="button"
                        className={`inicioClienteMovAccion ${favoritos[producto.id] ? 'inicioClienteMovAccionActiva' : ''}`}
                        aria-label="Favorito"
                        aria-pressed={!!favoritos[producto.id]}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFavoritos((prev) => ({ ...prev, [producto.id]: !prev[producto.id] }));
                        }}
                      >
                        <IconoCorazon />
                      </button>
                      <button
                        type="button"
                        className="inicioClienteMovAccion"
                        aria-label="Ver"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirProducto(producto);
                        }}
                      >
                        <IconoOjo />
                      </button>
                    </div>

                    <div className="inicioClienteMovProductoImagen">
                      <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                    </div>
                  </div>

                  <div className="inicioClienteMovProductoInfo">
                    <p className="inicioClienteMovProductoNombre">{producto.nombre}</p>
                    <p className="inicioClienteMovProductoPrecio">
                      <span className="inicioClienteMovProductoPrecioActual">${producto.precio}</span>
                      {typeof producto.precioAnterior === 'number' && (
                        <span className="inicioClienteMovProductoPrecioAnterior">${producto.precioAnterior}</span>
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer ref={footerRef} className="inicioClienteMovFooter" aria-label="Footer" />
      </main>

      <Link
        to="/cliente/carrito"
        className="inicioClienteMovFab"
        style={{ bottom: `${offsetFab}px` }}
        aria-label="Abrir carrito"
      >
        <IconoCarrito />
      </Link>
    </div>
  );
}

export default InicioClienteMov;

import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UsuarioMenu from '../../empleado/UsuarioMenu';
import clipAzul from '../../../images/Clip_azul.svg';
import reactLogo from '../../../assets/react.svg';
import './InicioCliente.css';

type ProductoMasVendido = {
  id: string;
  nombre: string;
  precio: number;
  precioAnterior?: number;
  descuento?: number;
  imagen: string;
};

const productosMasVendidos: ProductoMasVendido[] = [
  { id: 'p-1', nombre: 'PINCEL', precio: 120, precioAnterior: 160, descuento: 40, imagen: reactLogo },
  { id: 'p-2', nombre: 'Pinceles', precio: 960, precioAnterior: 1160, descuento: 35, imagen: reactLogo },
  { id: 'p-3', nombre: 'Brocha', precio: 370, precioAnterior: 400, descuento: 30, imagen: reactLogo },
  { id: 'p-4', nombre: 'combo', precio: 375, precioAnterior: 400, descuento: 25, imagen: reactLogo },
  { id: 'p-5', nombre: 'brochas', precio: 375, precioAnterior: 400, descuento: 25, imagen: reactLogo },
  { id: 'p-6', nombre: 'brocha', precio: 375, precioAnterior: 400, descuento: 25, imagen: reactLogo },
  { id: 'p-7', nombre: 'Cuaderno', precio: 45, precioAnterior: 60, descuento: 25, imagen: reactLogo },
  { id: 'p-8', nombre: 'Lapices', precio: 25, precioAnterior: 40, descuento: 37, imagen: reactLogo },
  { id: 'p-9', nombre: 'Marcadores', precio: 55, precioAnterior: 80, descuento: 31, imagen: reactLogo },
  { id: 'p-10', nombre: 'Resaltadores', precio: 30, precioAnterior: 45, descuento: 33, imagen: reactLogo },
  { id: 'p-11', nombre: 'Carpeta', precio: 20, precioAnterior: 28, descuento: 28, imagen: reactLogo },
  { id: 'p-12', nombre: 'Pegamento', precio: 15, precioAnterior: 22, descuento: 32, imagen: reactLogo },
];

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

function IconoFlecha({ direccion }: { direccion: 'izquierda' | 'derecha' }) {
  const d =
    direccion === 'izquierda'
      ? 'M18 12H6M10.5 7.5 6 12l4.5 4.5'
      : 'M6 12h12M13.5 7.5 18 12l-4.5 4.5';

  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function InicioCliente() {
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});
  const carruselRef = useRef<HTMLDivElement | null>(null);
  const arrastreRef = useRef<{ activo: boolean; x: number; scrollLeft: number }>(
    { activo: false, x: 0, scrollLeft: 0 },
  );

  const obtenerPasoScroll = () => {
    const contenedor = carruselRef.current;
    if (!contenedor) {
      return 260;
    }

    const primerItem = contenedor.querySelector<HTMLElement>('.inicioClienteProducto');
    if (!primerItem) {
      return Math.max(220, Math.round(contenedor.clientHeight * 0.6));
    }

    const estilos = window.getComputedStyle(contenedor);
    const gap = Number.parseFloat(estilos.columnGap || estilos.gap || '0') || 0;
    const ancho = primerItem.getBoundingClientRect().width;

    return Math.max(140, Math.round(ancho + gap));
  };

  const desplazarCarrusel = (direccion: 'izquierda' | 'derecha') => {
    const contenedor = carruselRef.current;
    if (!contenedor) {
      return;
    }

    const paso = obtenerPasoScroll();
    const left = direccion === 'izquierda' ? -paso : paso;
    contenedor.scrollBy({ left, behavior: 'smooth' });
  };

  const alIniciarArrastre = (event: ReactPointerEvent<HTMLDivElement>) => {
    const contenedor = carruselRef.current;
    if (!contenedor) {
      return;
    }

    arrastreRef.current = { activo: true, x: event.clientX, scrollLeft: contenedor.scrollLeft };
    contenedor.setPointerCapture(event.pointerId);
  };

  const alArrastrar = (event: ReactPointerEvent<HTMLDivElement>) => {
    const contenedor = carruselRef.current;
    if (!contenedor || !arrastreRef.current.activo) {
      return;
    }

    const delta = event.clientX - arrastreRef.current.x;
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

  return (
    <div className="inicioCliente" id="inicio-cliente">
      <header className="inicioClienteEncabezado">
        <div className="inicioClienteBarraSuperior">
          <div className="inicioClienteBarraInterior">
            <div className="inicioClienteMarca" aria-label="Paper world">
              <img className="inicioClienteMarcaIcono" src={clipAzul} alt="Clip" />
              <span className="inicioClienteMarcaTexto">Paper world</span>
            </div>

            <form className="inicioClienteBuscador" role="search" aria-label="Busqueda">
              <span className="inicioClienteBuscadorIcono" aria-hidden="true">
                <IconoLupa />
              </span>
              <input
                className="inicioClienteBuscadorInput"
                type="search"
                placeholder="Busca por productos, categorias, etc..."
                name="q"
                autoComplete="off"
              />
            </form>

            <div className="inicioClienteAcciones">
              <UsuarioMenu className="clienteUsuarioMenu" ariaLabel="Menu de usuario" />

              <Link to="/cliente/carrito" className="inicioClienteCarrito" aria-label="Carrito">
                <span className="inicioClienteCarritoIcono" aria-hidden="true">
                  <IconoCarrito />
                </span>
                <span className="inicioClienteCarritoContador" aria-label="Productos en carrito">
                  0
                </span>
              </Link>

              <p className="inicioClienteTotal" aria-label="Total del carrito">
                AED 0.00
              </p>
            </div>
          </div>

          <nav className="inicioClienteBarraNav" aria-label="Navegacion principal">
            <NavLink
              to="/cliente/catalogo"
              className={({ isActive }) =>
                `inicioClienteNavItem ${isActive ? 'inicioClienteNavItemActivo' : ''}`
              }
            >
              <span className="inicioClienteNavIcono" aria-hidden="true">
                <IconoCatalogo />
              </span>
              <span className="inicioClienteNavTexto">Catalogo</span>
            </NavLink>

            <NavLink
              to="/cliente/inicio"
              className={({ isActive }) =>
                `inicioClienteNavItem ${isActive ? 'inicioClienteNavItemActivo' : ''}`
              }
              end
            >
              <span className="inicioClienteNavIcono" aria-hidden="true">
                <IconoInicio />
              </span>
              <span className="inicioClienteNavTexto">Inicio</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="inicioClienteContenido">
        <section className="inicioClienteHero" aria-label="Banner principal">
          <div className="inicioClienteHeroMarco">
            <div className="inicioClienteHeroTexto">
              <p className="inicioClienteHeroKicker">TODO lo que necesitas</p>
              <p className="inicioClienteHeroSubkicker">— en un solo lugar —</p>
              <h2 className="inicioClienteHeroTitulo" aria-label="PaperWorld">
                Paper<span>World</span>
              </h2>
            </div>

            <div className="inicioClienteHeroCategorias" aria-label="Categorias destacadas">
              <div className="inicioClienteHeroCategoria">Utiles Escolares</div>
              <div className="inicioClienteHeroCategoria">Oficina</div>
              <div className="inicioClienteHeroCategoria">Papeleria</div>
              <div className="inicioClienteHeroCategoria">Regalos</div>
            </div>

            <p className="inicioClienteHeroPie">Variedad y calidad en todas nuestras categorias</p>
          </div>
        </section>

        <section className="inicioClienteSeccion" aria-label="Mas vendidos">
          <header className="inicioClienteSeccionEncabezado">
            <span className="inicioClienteEtiqueta">Este mes</span>
            <h3 className="inicioClienteSeccionTitulo">Mas Vendidos</h3>
          </header>

          <div className="inicioClienteCarruselHorizontal" aria-label="Carrusel de productos">
            <div className="inicioClienteCarruselControles" aria-label="Controles del carrusel">
              <button
                type="button"
                className="inicioClienteCarruselBoton inicioClienteCarruselBotonIzq"
                onClick={() => desplazarCarrusel('izquierda')}
                aria-label="Mover productos a la izquierda"
              >
                <IconoFlecha direccion="izquierda" />
              </button>
              <button
                type="button"
                className="inicioClienteCarruselBoton inicioClienteCarruselBotonDer"
                onClick={() => desplazarCarrusel('derecha')}
                aria-label="Mover productos a la derecha"
              >
                <IconoFlecha direccion="derecha" />
              </button>
            </div>

            <div
              className="inicioClienteCarrusel"
              role="list"
              ref={carruselRef}
              onPointerDown={alIniciarArrastre}
              onPointerMove={alArrastrar}
              onPointerUp={alFinalizarArrastre}
              onPointerCancel={alFinalizarArrastre}
            >
              {productosMasVendidos.map((producto) => (
                <article key={producto.id} className="inicioClienteProducto" role="listitem">
                  <div className="inicioClienteProductoMarco">
                    {typeof producto.descuento === 'number' && (
                      <span className="inicioClienteProductoDescuento">-{producto.descuento}%</span>
                    )}

                    <div className="inicioClienteProductoAcciones" aria-label="Acciones">
                      <button
                        type="button"
                        className={`inicioClienteProductoAccion ${
                          favoritos[producto.id] ? 'inicioClienteProductoAccionActiva' : ''
                        }`}
                        aria-label="Agregar a favoritos"
                        aria-pressed={!!favoritos[producto.id]}
                        onClick={() =>
                          setFavoritos((prev) => ({ ...prev, [producto.id]: !prev[producto.id] }))
                        }
                      >
                        <IconoCorazon />
                      </button>
                      <button
                        type="button"
                        className="inicioClienteProductoAccion"
                        aria-label="Ver"
                      >
                        <IconoOjo />
                      </button>
                    </div>

                    <div className="inicioClienteProductoImagen">
                      <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                    </div>

                    <button type="button" className="inicioClienteProductoAgregar">
                      Add To Cart
                    </button>
                  </div>

                  <div className="inicioClienteProductoInfo">
                    <p className="inicioClienteProductoNombre">{producto.nombre}</p>
                    <p className="inicioClienteProductoPrecio">
                      <span className="inicioClienteProductoPrecioActual">${producto.precio}</span>
                      {typeof producto.precioAnterior === 'number' && (
                        <span className="inicioClienteProductoPrecioAnterior">
                          ${producto.precioAnterior}
                        </span>
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default InicioCliente;

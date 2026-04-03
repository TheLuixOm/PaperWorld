import { Link, NavLink } from 'react-router-dom';
import UsuarioMenu from '../../empleado/UsuarioMenu';
import clipAzul from '../../../images/Clip_azul.svg';
import reactLogo from '../../../assets/react.svg';
import '../inicio/InicioCliente.css';
import './CatalogoCliente.css';

type ProductoCatalogo = {
  id: string;
  nombre: string;
  precio: number;
  precioAnterior?: number;
  etiqueta?: 'New' | 'Sale';
  imagen: string;
};

const categorias = [
  'Papel',
  'pinceles',
  'pinceles',
  'pinceles',
  'pinceles',
  'pinceles',
  'pinceles',
  'pinceles Color',
  'pinceles',
  'pinceles',
  'pinceles',
  'pinceles',
  'pinceles',
];

const marcas = ['Brand name', 'Brand name', 'Brand name', 'Brand name', 'Brand name'];

const productosCatalogo: ProductoCatalogo[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `c-${i + 1}`,
  nombre: 'un producto de los kito muy',
  precio: 76.6,
  precioAnterior: 80.0,
  etiqueta: i % 3 === 0 ? 'New' : i % 4 === 0 ? 'Sale' : undefined,
  imagen: reactLogo,
}));

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

function IconoChevronDerecha() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M10 6l6 6-6 6" />
    </svg>
  );
}

function CatalogoCliente() {
  return (
    <div className="inicioCliente catalogoCliente" id="catalogo-cliente">
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
              end
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

        <section className="catalogoClienteBusqueda" aria-label="Busqueda de catalogo">
          <span className="catalogoClienteBusquedaIcono" aria-hidden="true">
            <IconoLupa />
          </span>
          <input
            className="catalogoClienteBusquedaInput"
            type="search"
            placeholder="Catalogo, brand, etc..."
            aria-label="Buscar en catalogo"
          />
        </section>

        <section className="catalogoClienteCuerpo" aria-label="Catalogo">
          <aside className="catalogoClienteFiltros" aria-label="Filtros">
            <article className="catalogoClienteFiltroBloque" aria-label="Filtro categoria">
              <header className="catalogoClienteFiltroEncabezado">
                <h3 className="catalogoClienteFiltroTitulo">Catogory</h3>
                <button type="button" className="catalogoClienteFiltroAll">ALL</button>
              </header>

              <div className="catalogoClienteFiltroLista" role="list">
                {categorias.map((categoria, index) => (
                  <label key={`${categoria}-${index}`} className="catalogoClienteCheck" role="listitem">
                    <input type="checkbox" />
                    <span className="catalogoClienteCheckCaja" aria-hidden="true" />
                    <span className="catalogoClienteCheckTexto">{categoria}</span>
                  </label>
                ))}
              </div>
            </article>

            <article className="catalogoClienteFiltroBloque" aria-label="Filtro marca">
              <header className="catalogoClienteFiltroEncabezado">
                <h3 className="catalogoClienteFiltroTitulo">Algo</h3>
                <button type="button" className="catalogoClienteFiltroAll">ALL</button>
              </header>

              <div className="catalogoClienteFiltroLista" role="list">
                {marcas.map((marca, index) => (
                  <label key={`${marca}-${index}`} className="catalogoClienteCheck" role="listitem">
                    <input type="checkbox" />
                    <span className="catalogoClienteCheckCaja" aria-hidden="true" />
                    <span className="catalogoClienteCheckTexto">{marca}</span>
                  </label>
                ))}
              </div>
            </article>
          </aside>

          <section className="catalogoClienteResultados" aria-label="Resultados">
            <div className="catalogoClienteGrid" role="list">
              {productosCatalogo.map((producto) => (
                <article key={producto.id} className="catalogoClienteProducto" role="listitem">
                  <div className="catalogoClienteProductoMarco">
                    {producto.etiqueta && (
                      <span
                        className={`catalogoClienteProductoTag ${producto.etiqueta === 'New' ? 'catalogoClienteProductoTagNew' : 'catalogoClienteProductoTagSale'}`}
                      >
                        {producto.etiqueta}
                      </span>
                    )}

                    <div className="catalogoClienteProductoImagen">
                      <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                    </div>

                    <button type="button" className="catalogoClienteProductoCarrito" aria-label="Agregar al carrito">
                      <IconoCarrito />
                    </button>
                  </div>

                  <div className="catalogoClienteProductoInfo">
                    <p className="catalogoClienteProductoNombre">{producto.nombre}</p>
                    <p className="catalogoClienteProductoPrecio">
                      <span className="catalogoClienteProductoPrecioActual">AED {producto.precio}</span>
                      {typeof producto.precioAnterior === 'number' && (
                        <span className="catalogoClienteProductoPrecioAnterior">{producto.precioAnterior}</span>
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <nav className="catalogoClientePaginacion" aria-label="Paginacion">
              <button type="button" className="catalogoClientePagina catalogoClientePaginaActiva" aria-current="page">
                1
              </button>
              <button type="button" className="catalogoClientePagina">2</button>
              <button type="button" className="catalogoClientePagina">3</button>
              <button type="button" className="catalogoClientePagina" aria-label="Siguiente pagina">
                <IconoChevronDerecha />
              </button>
            </nav>
          </section>
        </section>
      </main>

      <footer className="catalogoClienteFooter" aria-label="Footer" />
    </div>
  );
}

export default CatalogoCliente;

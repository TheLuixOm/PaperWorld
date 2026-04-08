import { useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UsuarioMenu from '../../empleado/Barras/UsuarioMenu';
import clipAzul from '../../../images/Clip_azul.svg';
import reactLogo from '../../../assets/react.svg';
import '../inicio/InicioCliente.css';
import './CarritoCliente.css';

type ItemCarritoPc = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  order: string;
  dia: string;
  nClient: string;
  cantidad: number;
};

const itemsIniciales: ItemCarritoPc[] = [
  {
    id: 'pc-1',
    nombre: 'Brochas',
    precio: 500.26,
    imagen: reactLogo,
    order: '321012456',
    dia: '17/2/2026',
    nClient: '3217796',
    cantidad: 1,
  },
  {
    id: 'pc-2',
    nombre: 'Brochas',
    precio: 10.6,
    imagen: reactLogo,
    order: '321012456',
    dia: '17/2/2026',
    nClient: '3217796',
    cantidad: 5,
  },
  {
    id: 'pc-3',
    nombre: 'Brochas',
    precio: 2.26,
    imagen: reactLogo,
    order: '321012456',
    dia: '17/2/2026',
    nClient: '3217796',
    cantidad: 9,
  },
  {
    id: 'pc-4',
    nombre: 'Brochas',
    precio: 152.26,
    imagen: reactLogo,
    order: '321012456',
    dia: '17/2/2026',
    nClient: '3217796',
    cantidad: 8,
  },
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

function Carrito() {
  const [items, setItems] = useState<ItemCarritoPc[]>(itemsIniciales);

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [items],
  );

  const actualizarCantidad = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }
        return { ...item, cantidad: Math.max(1, item.cantidad + delta) };
      }),
    );
  };

  const remover = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="inicioCliente carritoCliente" id="carrito-cliente">
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
                  {items.length}
                </span>
              </Link>

              <p className="inicioClienteTotal" aria-label="Total del carrito">
                USD 200
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

      <main className="carritoClienteContenido">
        <div className="carritoClienteTitulo" aria-label="Carrito">
          <h1>Carrito</h1>
          <span className="carritoClienteTituloIcono" aria-hidden="true">
            <IconoCarrito />
            <span className="carritoClienteTituloBadge">{items.length}</span>
          </span>
        </div>

        <div className="carritoClienteSeparador" aria-hidden="true" />

        <section className="carritoClienteLista" aria-label="Lista de items" role="list">
          {items.map((item) => (
            <article key={item.id} className="carritoClienteFila" role="listitem">
              <div className="carritoClienteImg">
                <img src={item.imagen} alt={item.nombre} loading="lazy" />
              </div>

              <div className="carritoClienteInfo">
                <p className="carritoClienteNombre">{item.nombre}</p>
                <div className="carritoClienteMeta">
                  <p>
                    <strong>Orden:</strong> {item.order}
                  </p>
                  <p>
                    <strong>Dia:</strong> {item.dia}
                  </p>
                  <p>
                    <strong>N° Client:</strong> {item.nClient}
                  </p>
                </div>
              </div>

              <div className="carritoClienteQty" aria-label="Cantidad">
                <button
                  type="button"
                  className="carritoClienteQtyBtn"
                  aria-label="Disminuir"
                  onClick={() => actualizarCantidad(item.id, -1)}
                >
                  −
                </button>
                <span className="carritoClienteQtyValor" aria-label="Cantidad">
                  {item.cantidad}
                </span>
                <button
                  type="button"
                  className="carritoClienteQtyBtn"
                  aria-label="Aumentar"
                  onClick={() => actualizarCantidad(item.id, 1)}
                >
                  +
                </button>
              </div>

              <div className="carritoClienteAcciones" aria-label="Acciones">
                <p className="carritoClientePrecio">{item.precio.toFixed(2)} $</p>
                <button type="button" className="carritoClienteRemove" onClick={() => remover(item.id)}>
                  Remover
                </button>
              </div>
            </article>
          ))}
        </section>

        <div className="carritoClienteResumen" aria-label="Resumen">
          <p className="carritoClienteResumenLabel">Total</p>
          <p className="carritoClienteResumenValor">{total.toFixed(2)} $</p>
          <button type="button" className="carritoClienteComprar">
            Comprar
          </button>
        </div>
      </main>

      <footer className="carritoClienteFooter" aria-label="Footer" />
    </div>
  );
}

export default Carrito;


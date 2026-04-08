import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import UsuarioMenu from '../../empleado/Barras/UsuarioMenu';
import MenuLateralMovil from '../componentes/MenuLateralMovil';
import clipAzul from '../../../images/Clip_azul.svg';
import reactLogo from '../../../assets/react.svg';
import '../inicio/InicioClienteMov.css';
import './CarritoMov.css';

type ItemCarritoMov = {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  order: string;
  did: string;
  nClient: string;
  cantidad: number;
};

const itemsBase: ItemCarritoMov[] = [
  {
    id: 'cm-1',
    nombre: 'Brochas',
    precio: 500.26,
    imagen: reactLogo,
    order: '321012456',
    did: '17/2/2026',
    nClient: '3217796',
    cantidad: 1,
  },
  {
    id: 'cm-2',
    nombre: 'Brochas',
    precio: 500.26,
    imagen: reactLogo,
    order: '321012456',
    did: '17/2/2026',
    nClient: '3217796',
    cantidad: 1,
  },
  {
    id: 'cm-3',
    nombre: 'Brochas',
    precio: 500.26,
    imagen: reactLogo,
    order: '321012456',
    did: '17/2/2026',
    nClient: '3217796',
    cantidad: 1,
  },
  {
    id: 'cm-4',
    nombre: 'Brochas',
    precio: 500.26,
    imagen: reactLogo,
    order: '321012456',
    did: '17/2/2026',
    nClient: '3217796',
    cantidad: 1,
  },
  {
    id: 'cm-5',
    nombre: 'Brochas',
    precio: 500.26,
    imagen: reactLogo,
    order: '321012456',
    did: '17/2/2026',
    nClient: '3217796',
    cantidad: 1,
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

function IconoCarrito() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <circle cx="9" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
      <path d="M3 5h2l2.2 9.2h10.4l2-6.5H6.1" />
    </svg>
  );
}

function IconoBasura() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M10 11v7" />
      <path d="M14 11v7" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function CarritoMov() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [items, setItems] = useState<ItemCarritoMov[]>(itemsBase);

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
        const nueva = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: nueva };
      }),
    );
  };

  const eliminarItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="inicioClienteMov carritoMov" id="carrito-mov">
      <MenuLateralMovil abierto={menuAbierto} alCerrar={() => setMenuAbierto(false)} />

      <header className="inicioClienteMovHeader carritoMovHeader">
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

          <div className="carritoMovAcciones">
            <UsuarioMenu className="clienteUsuarioMenuMov" ariaLabel="Menu de usuario" />

            <div className="carritoMovAccionCarrito" aria-label="Carrito">
              <span className="carritoMovCarritoIcono" aria-hidden="true">
                <IconoCarrito />
              </span>
              <span className="carritoMovCarritoBadge" aria-label="Productos en carrito">
                {items.length}
              </span>
            </div>

            <p className="carritoMovTotalTop" aria-label="Total del carrito">
              USD 0.00
            </p>
          </div>
        </div>
      </header>

      <main className="inicioClienteMovMain carritoMovMain">
        <section className="carritoMovTitulo" aria-label="Titulo">
          <h1 className="carritoMovTituloTexto">Carrito</h1>
          <span className="carritoMovTituloBadge" aria-label="Cantidad">
            {items.length}
          </span>
        </section>

        <div className="carritoMovLinea" aria-hidden="true" />

        <section className="carritoMovLista" aria-label="Items" role="list">
          {items.map((item) => (
            <article key={item.id} className="carritoMovItem" role="listitem">
              <div className="carritoMovItemImagen">
                <img src={item.imagen} alt={item.nombre} loading="lazy" />
              </div>

              <div className="carritoMovItemInfo">
                <div className="carritoMovItemEnc">
                  <div className="carritoMovItemIzq">
                    <p className="carritoMovItemNombre">{item.nombre}</p>

                    <div className="carritoMovItemMeta">
                      <p>
                        <span>Order: </span>
                        {item.order}
                      </p>
                      <p>
                        <span>Did: </span>
                        {item.did}
                      </p>
                      <p>
                        <span>N° Client: </span>
                        {item.nClient}
                      </p>
                    </div>
                  </div>

                  <div className="carritoMovItemDer">
                    <p className="carritoMovItemPrecio">{item.precio.toFixed(2)} $</p>

                    <div className="carritoMovQtyRow" aria-label="Cantidad">
                      <button
                        type="button"
                        className="carritoMovQtyBtn"
                        aria-label="Disminuir"
                        onClick={() => actualizarCantidad(item.id, -1)}
                      >
                        −
                      </button>
                      <span className="carritoMovQtyValue" aria-label="Cantidad">
                        {item.cantidad}
                      </span>
                      <button
                        type="button"
                        className="carritoMovQtyBtn"
                        aria-label="Aumentar"
                        onClick={() => actualizarCantidad(item.id, 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="carritoMovTrash"
                      aria-label="Eliminar"
                      onClick={() => eliminarItem(item.id)}
                    >
                      <IconoBasura />
                    </button>
                  </div>
                </div>
              </div>

              <div className="carritoMovSeparador" aria-hidden="true" />
            </article>
          ))}
        </section>

        <section className="carritoMovResumen" aria-label="Resumen">
          <div className="carritoMovLinea" aria-hidden="true" />
          <div className="carritoMovResumenFila">
            <p className="carritoMovResumenLabel">Total</p>
            <p className="carritoMovResumenValor">{total.toFixed(2)} $</p>
          </div>

          <div className="carritoMovLinea" aria-hidden="true" />

          <button type="button" className="carritoMovComprar">
            Comprar
          </button>
        </section>

        <div className="carritoMovEspaciador" aria-hidden="true" />
      </main>

      <Link to="/cliente/catalogo" className="carritoMovVolver" aria-label="Volver a catalogo">
        Volver al catalogo
      </Link>
    </div>
  );
}

export default CarritoMov;

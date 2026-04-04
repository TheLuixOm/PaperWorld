import { useCallback, useEffect, useRef, useState } from 'react';
import './ProductoExpandidoMov.css';

const CIERRE_MS = 180;

export type ProductoExpandidoMovData = {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen: string;
  codigo?: string;
  stock?: number;
  categoria?: string;
  precioDetalle?: number;
};

type Props = {
  abierto: boolean;
  producto: ProductoExpandidoMovData | null;
  alCerrar: () => void;
};

function IconoAtras() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M15 18 9 12l6-6" />
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

export default function ProductoExpandidoMov({ abierto, producto, alCerrar }: Props) {
  const [estadoAnimacion, setEstadoAnimacion] = useState<'opening' | 'open' | 'closing'>('opening');
  const cierreTimeoutRef = useRef<number | null>(null);

  const cerrarConAnimacion = useCallback(() => {
    setEstadoAnimacion((prev) => (prev === 'closing' ? prev : 'closing'));

    if (cierreTimeoutRef.current != null) {
      window.clearTimeout(cierreTimeoutRef.current);
    }

    cierreTimeoutRef.current = window.setTimeout(() => {
      alCerrar();
    }, CIERRE_MS);
  }, [alCerrar]);

  useEffect(() => {
    if (!abierto) {
      return;
    }

    setEstadoAnimacion('opening');
    const raf = window.requestAnimationFrame(() => {
      setEstadoAnimacion('open');
    });

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;

      if (cierreTimeoutRef.current != null) {
        window.clearTimeout(cierreTimeoutRef.current);
      }
    };
  }, [abierto]);

  if (!abierto || !producto) {
    return null;
  }

  const codigo = producto.codigo ?? '8901425031926';
  const stock = typeof producto.stock === 'number' ? producto.stock : 350;
  const categoria = producto.categoria ?? 'hola';
  const precioDetalle = typeof producto.precioDetalle === 'number' ? producto.precioDetalle : 9;
  const descripcion = producto.descripcion ?? 'esto es una descripcion';

  return (
    <div
      className="productoExpandidoMovOverlay"
      data-state={estadoAnimacion}
      role="presentation"
      onClick={cerrarConAnimacion}
      aria-label="Cerrar detalle de producto"
    >
      <section
        className="productoExpandidoMovModal"
        data-state={estadoAnimacion}
        role="dialog"
        aria-modal="true"
        aria-label="Detalle del producto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="productoExpandidoMovTop">
          <button
            type="button"
            className="productoExpandidoMovAtras"
            aria-label="Volver"
            onClick={cerrarConAnimacion}
          >
            <IconoAtras />
          </button>
        </div>

        <div className="productoExpandidoMovImagen" aria-label="Imagen del producto">
          <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
        </div>

        <div className="productoExpandidoMovBody">
          <p className="productoExpandidoMovCodigo">CODIGO: {codigo}</p>

          <div className="productoExpandidoMovNombreFila">
            <p className="productoExpandidoMovNombre">Nombre del producto - {producto.nombre}</p>
          </div>

          <p className="productoExpandidoMovDescripcionCorta">{descripcion}</p>

          <button
            type="button"
            className="productoExpandidoMovReadMore"
            onClick={(e) => e.preventDefault()}
          >
            Leer mas
          </button>

          <p className="productoExpandidoMovPrecio">AED {producto.precio.toFixed(2)}</p>

          <div className="productoExpandidoMovAcciones">
            <button type="button" className="productoExpandidoMovCancelar" onClick={cerrarConAnimacion}>
              Cancelar
            </button>
            <button type="button" className="productoExpandidoMovAgregar">
              <span className="productoExpandidoMovAgregarIcono" aria-hidden="true">
                <IconoCarrito />
              </span>
              <span>Añadir al carrito</span>
            </button>
          </div>

          <h3 className="productoExpandidoMovSeccionTitulo">Detalles de Producto</h3>

          <div className="productoExpandidoMovDetalles">
            <div className="productoExpandidoMovDetalle">
              <p className="productoExpandidoMovDetalleLabel">Stock</p>
              <p className="productoExpandidoMovDetalleValor">{stock}</p>
            </div>
            <div className="productoExpandidoMovDetalle">
              <p className="productoExpandidoMovDetalleLabel">Codigo</p>
              <p className="productoExpandidoMovDetalleValor">{codigo}</p>
            </div>
            <div className="productoExpandidoMovDetalle">
              <p className="productoExpandidoMovDetalleLabel">Precio</p>
              <p className="productoExpandidoMovDetalleValor">{precioDetalle.toFixed(2)} AED</p>
            </div>
            <div className="productoExpandidoMovDetalle">
              <p className="productoExpandidoMovDetalleLabel">Categoria</p>
              <p className="productoExpandidoMovDetalleValor">{categoria}</p>
            </div>
          </div>

          <div className="productoExpandidoMovDescripcion">
            <p className="productoExpandidoMovDetalleLabel">Descripción</p>
            <p className="productoExpandidoMovDetalleValor">{descripcion}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

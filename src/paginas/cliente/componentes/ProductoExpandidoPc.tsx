import { useCallback, useEffect, useRef, useState } from 'react';
import './ProductoExpandidoPc.css';

const CIERRE_MS = 180;

export type ProductoExpandidoPcData = {
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
  producto: ProductoExpandidoPcData | null;
  alCerrar: () => void;
};

function IconoCarrito() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <circle cx="9" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
      <path d="M3 5h2l2.2 9.2h10.4l2-6.5H6.1" />
    </svg>
  );
}

export default function ProductoExpandidoPc({ abierto, producto, alCerrar }: Props) {
  const [estadoAnimacion, setEstadoAnimacion] = useState<'opening' | 'open' | 'closing'>('opening');
  const cierreTimeoutRef = useRef<number | null>(null);
  const modalRef = useRef<HTMLElement | null>(null);

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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cerrarConAnimacion();
      }
    };

    const onPointerDownCapture = (e: PointerEvent) => {
      const modal = modalRef.current;
      if (!modal) {
        return;
      }

      const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
      if (path.includes(modal)) {
        return;
      }

      cerrarConAnimacion();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDownCapture, true);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDownCapture, true);

      if (cierreTimeoutRef.current != null) {
        window.clearTimeout(cierreTimeoutRef.current);
      }
    };
  }, [abierto, cerrarConAnimacion]);

  if (!abierto || !producto) {
    return null;
  }

  const codigo = producto.codigo ?? '002315640';
  const stock = typeof producto.stock === 'number' ? producto.stock : 350;
  const categoria = producto.categoria ?? 'hola';
  const precioDetalle = typeof producto.precioDetalle === 'number' ? producto.precioDetalle : 5;
  const descripcion = producto.descripcion ?? 'esto es una descripcion';

  return (
    <div
      className="productoExpandidoPcOverlay"
      data-state={estadoAnimacion}
      role="presentation"
    >
      <section
        className="productoExpandidoPcModal"
        data-state={estadoAnimacion}
        role="dialog"
        aria-modal="true"
        aria-label="Detalle del producto"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="productoExpandidoPcGrid">
          <div className="productoExpandidoPcIzq">
            <div className="productoExpandidoPcImagen" aria-label="Imagen del producto">
              <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
            </div>

            <div className="productoExpandidoPcInfo">
              <p className="productoExpandidoPcCodigo">CODIGO: {codigo}</p>
              <p className="productoExpandidoPcNombre">Nombre del producto - {producto.nombre}</p>
              <button type="button" className="productoExpandidoPcReadMore" onClick={(e) => e.preventDefault()}>
                Leer mas
              </button>
              <p className="productoExpandidoPcPrecio">AED {producto.precio.toFixed(2)}</p>
            </div>
          </div>

          <div className="productoExpandidoPcDer">
            <h2 className="productoExpandidoPcTitulo">Detalles de Producto</h2>

            <div className="productoExpandidoPcDetalles">
              <div className="productoExpandidoPcDetalle">
                <p className="productoExpandidoPcDetalleLabel">Stock</p>
                <p className="productoExpandidoPcDetalleValor">{stock}</p>
              </div>
              <div className="productoExpandidoPcDetalle">
                <p className="productoExpandidoPcDetalleLabel">Codigo</p>
                <p className="productoExpandidoPcDetalleValor">{codigo}</p>
              </div>
              <div className="productoExpandidoPcDetalle">
                <p className="productoExpandidoPcDetalleLabel">Precio</p>
                <p className="productoExpandidoPcDetalleValor">{precioDetalle.toFixed(2)} bs</p>
              </div>
              <div className="productoExpandidoPcDetalle">
                <p className="productoExpandidoPcDetalleLabel">categoria</p>
                <p className="productoExpandidoPcDetalleValor">{categoria}</p>
              </div>
              <div className="productoExpandidoPcDetalle productoExpandidoPcDetalleFull">
                <p className="productoExpandidoPcDetalleLabel">Description</p>
                <p className="productoExpandidoPcDetalleValor">{descripcion}</p>
              </div>
            </div>

            <div className="productoExpandidoPcAcciones">
              <button type="button" className="productoExpandidoPcCancelar" onClick={cerrarConAnimacion}>
                Cancelar
              </button>
              <button type="button" className="productoExpandidoPcAgregar">
                <span className="productoExpandidoPcAgregarIcono" aria-hidden="true">
                  <IconoCarrito />
                </span>
                <span>Añadir al carrito</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

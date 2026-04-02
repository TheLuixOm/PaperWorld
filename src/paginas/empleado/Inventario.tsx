import { useEffect, useMemo, useState } from 'react';
import './Inventario.css';
import { productosIniciales } from './datosInventario';
import UsuarioMenu from './UsuarioMenu';

function Inventario() {
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [productos, setProductos] = useState(productosIniciales);
    const [paginaActual, setPaginaActual] = useState(1);
    const productosPorPagina = 8;

    const eliminarProducto = (id: string) => {
        setProductos((productosActuales) => productosActuales.filter((producto) => producto.id !== id));
    };

    const productosFiltrados = useMemo(() => {
        const textoNormalizado = textoBusqueda.trim().toLowerCase();

        if (!textoNormalizado) {
            return productos;
        }

        return productos.filter((producto) => {
            return (
                producto.nombre.toLowerCase().includes(textoNormalizado) ||
                producto.categoria.toLowerCase().includes(textoNormalizado) ||
                producto.id.toLowerCase().includes(textoNormalizado)
            );
        });
    }, [productos, textoBusqueda]);

    const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / productosPorPagina));

    useEffect(() => {
        if (paginaActual > totalPaginas) {
            setPaginaActual(totalPaginas);
        }
    }, [paginaActual, totalPaginas]);

    const productosVisibles = useMemo(() => {
        const indiceInicial = (paginaActual - 1) * productosPorPagina;
        const indiceFinal = indiceInicial + productosPorPagina;

        return productosFiltrados.slice(indiceInicial, indiceFinal);
    }, [paginaActual, productosFiltrados]);

    const paginas = useMemo(() => {
        return Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
    }, [totalPaginas]);

    return (
        <section className="inventarioVista" id="inventario">
                <header className="inventarioEncabezado">
                    <h2 className="inventarioTitulo">INVENTARIO</h2>

                    <label className="inventarioBuscador">
                        <span className="inventarioBuscadorIcono" aria-hidden="true">
                            <svg viewBox="0 0 24 24" focusable="false">
                                <circle cx="11" cy="11" r="6" />
                                <line x1="15.5" y1="15.5" x2="21" y2="21" />
                            </svg>
                        </span>
                        <input
                            type="search"
                            placeholder="Search"
                            className="inventarioInput"
                            aria-label="Buscar producto"
                            value={textoBusqueda}
                            onChange={(event) => {
                                setTextoBusqueda(event.target.value);
                                setPaginaActual(1);
                            }}
                        />
                    </label>

                    <button className="inventarioBotonAgregar" type="button">
                        <span className="inventarioBotonIcono" aria-hidden="true">+</span>
                        Añadir nuevo producto
                    </button>

                    <UsuarioMenu className="inventarioUsuarioMenu" ariaLabel="Perfil del usuario" />
                </header>

                <section className="inventarioPanel">
                    <h3 className="inventarioSubtitulo">Lista de productos:</h3>

                    <div className="inventarioTablaContenedor">
                        <table className="inventarioTabla">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Id</th>
                                    <th>Categoria</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                    <th>Imagen</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosVisibles.map((producto) => (
                                    <tr key={producto.id} className="inventarioFila">
                                        <td>
                                            <div className="inventarioCeldaNombre">
                                                <button className="inventarioAccion inventarioAccionEditar" type="button" aria-label={`Editar ${producto.nombre}`}>
                                                    <svg viewBox="0 0 24 24" focusable="false">
                                                        <path d="M4 20h4l10-10-4-4L4 16z" />
                                                        <path d="m12.8 6.8 4 4" />
                                                    </svg>
                                                </button>
                                                <span>{producto.nombre}</span>
                                            </div>
                                        </td>
                                        <td>{producto.id}</td>
                                        <td>{producto.categoria}</td>
                                        <td>{producto.precio}</td>
                                        <td>{producto.cantidad}</td>
                                        <td>
                                            <img className="inventarioImagen" src={producto.imagen} alt={producto.nombre} />
                                        </td>
                                        <td>
                                            <button
                                                className="inventarioAccion inventarioAccionEliminar"
                                                type="button"
                                                aria-label={`Eliminar ${producto.nombre}`}
                                                onClick={() => eliminarProducto(producto.id)}
                                            >
                                                <svg viewBox="0 0 24 24" focusable="false">
                                                    <path d="M5 7h14" />
                                                    <path d="M9 7V5h6v2" />
                                                    <path d="M8 7v12h8V7" />
                                                    <path d="M10 11v5" />
                                                    <path d="M14 11v5" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="inventarioPaginacion" aria-label="Paginacion">
                        <button
                            type="button"
                            className="inventarioPaginaBoton"
                            aria-label="Pagina anterior"
                            onClick={() => setPaginaActual((pagina) => Math.max(1, pagina - 1))}
                            disabled={paginaActual === 1}
                        >
                            ‹
                        </button>

                        {paginas.map((pagina) => (
                            <button
                                key={pagina}
                                type="button"
                                className={`inventarioPaginaBoton ${pagina === paginaActual ? 'inventarioPaginaActiva' : ''}`}
                                onClick={() => setPaginaActual(pagina)}
                                aria-current={pagina === paginaActual ? 'page' : undefined}
                            >
                                {pagina}
                            </button>
                        ))}

                        <button
                            type="button"
                            className="inventarioPaginaBoton"
                            aria-label="Pagina siguiente"
                            onClick={() => setPaginaActual((pagina) => Math.min(totalPaginas, pagina + 1))}
                            disabled={paginaActual === totalPaginas}
                        >
                            ›
                        </button>
                    </div>
                </section>
        </section>
    );
}

export default Inventario;

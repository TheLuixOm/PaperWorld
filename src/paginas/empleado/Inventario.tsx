import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inventario.css';

type Producto = {
    id: string;
    nombre: string;
    categoria: string;
    precio: string;
    cantidad: number;
    imagen: string;
};

const datosProductosIniciales = [
    { id: '#0001', nombre: 'hojas', categoria: 'papel', precio: '$ 1,241', cantidad: 50 },
    { id: '#0002', nombre: 'cuaderno', categoria: 'papel', precio: '$ 850', cantidad: 30 },
    { id: '#0003', nombre: 'lapiz', categoria: 'escritura', precio: '$ 120', cantidad: 120 },
    { id: '#0004', nombre: 'carpeta', categoria: 'oficina', precio: '$ 320', cantidad: 45 },
    { id: '#0005', nombre: 'resaltador', categoria: 'escritura', precio: '$ 95', cantidad: 80 },
    { id: '#0006', nombre: 'pegamento', categoria: 'oficina', precio: '$ 60', cantidad: 22 },
    { id: '#0007', nombre: 'grapadora', categoria: 'oficina', precio: '$ 210', cantidad: 18 },
    { id: '#0008', nombre: 'tijeras', categoria: 'oficina', precio: '$ 145', cantidad: 26 },
    { id: '#0009', nombre: 'regla', categoria: 'escritura', precio: '$ 55', cantidad: 60 },
    { id: '#0010', nombre: 'block', categoria: 'papel', precio: '$ 240', cantidad: 40 },
    { id: '#0011', nombre: 'marcador', categoria: 'escritura', precio: '$ 110', cantidad: 75 },
    { id: '#0012', nombre: 'sobre', categoria: 'papel', precio: '$ 30', cantidad: 150 },
    { id: '#0013', nombre: 'archivador', categoria: 'oficina', precio: '$ 390', cantidad: 14 },
    { id: '#0014', nombre: 'perforadora', categoria: 'oficina', precio: '$ 275', cantidad: 12 },
    { id: '#0015', nombre: 'nota adhesiva', categoria: 'papel', precio: '$ 75', cantidad: 90 },
    { id: '#0016', nombre: 'corrector', categoria: 'escritura', precio: '$ 88', cantidad: 48 },
    { id: '#0017', nombre: 'clip', categoria: 'oficina', precio: '$ 25', cantidad: 300 },
    { id: '#0018', nombre: 'goma', categoria: 'escritura', precio: '$ 40', cantidad: 100 },
    { id: '#0019', nombre: 'cinta', categoria: 'oficina', precio: '$ 130', cantidad: 34 },
    { id: '#0020', nombre: 'portaminas', categoria: 'escritura', precio: '$ 180', cantidad: 24 },
];

const productosIniciales: Producto[] = datosProductosIniciales.map((producto) => ({
    ...producto,
    imagen: `https://picsum.photos/seed/${producto.id.replace('#', '')}/120/80`,
}));

function Inventario() {
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [productos, setProductos] = useState(productosIniciales);
    const [mostrarPerfil, setMostrarPerfil] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const perfilPanelRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const productosPorPagina = 8;

    const nombreUsuarioGuardado = localStorage.getItem('paperworldUsuario')?.trim() || 'Usuario';

    const nombreMostrado = nombreUsuarioGuardado.includes('@')
        ? nombreUsuarioGuardado.split('@')[0]
        : nombreUsuarioGuardado;

    const eliminarProducto = (id: string) => {
        setProductos((productosActuales) => productosActuales.filter((producto) => producto.id !== id));
    };

    const cerrarSesion = () => {
        localStorage.removeItem('paperworldUsuario');
        setMostrarPerfil(false);
        navigate('/login');
    };

    useEffect(() => {
        const cerrarPerfil = (event: MouseEvent) => {
            if (perfilPanelRef.current && !perfilPanelRef.current.contains(event.target as Node)) {
                setMostrarPerfil(false);
            }
        };

        const cerrarConEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMostrarPerfil(false);
            }
        };

        document.addEventListener('mousedown', cerrarPerfil);
        document.addEventListener('keydown', cerrarConEscape);

        return () => {
            document.removeEventListener('mousedown', cerrarPerfil);
            document.removeEventListener('keydown', cerrarConEscape);
        };
    }, []);

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

                    <div className="inventarioPerfilAccion" ref={perfilPanelRef}>
                        <button
                            className="inventarioAvatar"
                            type="button"
                            aria-label="Perfil del usuario"
                            aria-expanded={mostrarPerfil}
                            onClick={() => setMostrarPerfil((estadoAnterior) => !estadoAnterior)}
                        >
                            <span>👤</span>
                        </button>

                        {mostrarPerfil && (
                            <div className="inventarioPerfilPanel" role="dialog" aria-label="Perfil de usuario">
                                <div className="inventarioPerfilCabecera">
                                    <div className="inventarioPerfilIdentidad">
                                        <div className="inventarioPerfilAvatarGrande" aria-hidden="true">
                                            {nombreMostrado.slice(0, 1).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="inventarioPerfilNombre">{nombreMostrado}</p>
                                            <p className="inventarioPerfilSubtexto">Admin</p>
                                        </div>
                                    </div>
                                    <span className="inventarioPerfilMas" aria-hidden="true">
                                        <span />
                                        <span />
                                        <span />
                                    </span>
                                </div>
                                <p className="inventarioPerfilTitulo">opciones de usuario</p>
                                <button type="button" className="inventarioPerfilOpcion" onClick={cerrarSesion}>
                                    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                                        <path d="M10 7V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-2" />
                                        <path d="M3 12h13" />
                                        <path d="m7 8 4 4-4 4" />
                                    </svg>
                                    <span>Cerrar sesion.</span>
                                </button>
                            </div>
                        )}
                    </div>
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

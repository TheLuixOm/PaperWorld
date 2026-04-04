import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import './Inventario.css';
import { productosIniciales, type Producto } from './datosInventario';
import UsuarioMenu from './UsuarioMenu';

type FormularioProducto = {
    nombre: string;
    referencia: string;
    categoria: string;
    precio: string;
    cantidad: string;
    descripcion: string;
};

const formularioVacio: FormularioProducto = {
    nombre: '',
    referencia: '',
    categoria: '',
    precio: '',
    cantidad: '',
    descripcion: '',
};

function Inventario() {
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [productos, setProductos] = useState(productosIniciales);
    const [vistaAgregarProducto, setVistaAgregarProducto] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [productoExpandidoId, setProductoExpandidoId] = useState<string | null>(null);
    const [busquedaMovilActiva, setBusquedaMovilActiva] = useState(false);
    const [formularioProducto, setFormularioProducto] = useState<FormularioProducto>(formularioVacio);
    const [imagenSeleccionada, setImagenSeleccionada] = useState<string>('');
    const inputBusquedaRef = useRef<HTMLInputElement | null>(null);
    const inputImagenRef = useRef<HTMLInputElement | null>(null);
    const productosPorPagina = 8;

    useEffect(() => {
        return () => {
            if (imagenSeleccionada.startsWith('blob:')) {
                URL.revokeObjectURL(imagenSeleccionada);
            }
        };
    }, [imagenSeleccionada]);

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

    const alternarExpandido = (id: string) => {
        setProductoExpandidoId((idActual) => (idActual === id ? null : id));
    };

    const activarBusquedaMovil = () => {
        setBusquedaMovilActiva(true);

        requestAnimationFrame(() => {
            inputBusquedaRef.current?.focus();
        });
    };

    const cerrarBusquedaMovilSiVacia = () => {
        if (!textoBusqueda.trim()) {
            setBusquedaMovilActiva(false);
        }
    };

    const actualizarCampoFormulario = (campo: keyof FormularioProducto, valor: string) => {
        setFormularioProducto((formularioActual) => ({
            ...formularioActual,
            [campo]: valor,
        }));
    };

    const limpiarFormulario = () => {
        setFormularioProducto(formularioVacio);
        setImagenSeleccionada('');

        if (inputImagenRef.current) {
            inputImagenRef.current.value = '';
        }
    };

    const abrirVistaAgregarProducto = () => {
        limpiarFormulario();
        setVistaAgregarProducto(true);
    };

    const cancelarAgregarProducto = () => {
        limpiarFormulario();
        setVistaAgregarProducto(false);
    };

    const generarIdProducto = () => {
        if (formularioProducto.referencia.trim()) {
            return formularioProducto.referencia.trim();
        }

        const mayorId = productos.reduce((maximoActual, productoActual) => {
            const numeroActual = Number(productoActual.id.replace(/[^0-9]/g, ''));

            if (Number.isNaN(numeroActual)) {
                return maximoActual;
            }

            return Math.max(maximoActual, numeroActual);
        }, 0);

        return `#${String(mayorId + 1).padStart(4, '0')}`;
    };

    const crearProductoDesdeFormulario = (): Producto => {
        const cantidad = Number.parseInt(formularioProducto.cantidad, 10);
        const precioConPrefijo = formularioProducto.precio.trim();

        return {
            id: generarIdProducto(),
            nombre: formularioProducto.nombre.trim() || 'Producto sin nombre',
            categoria: formularioProducto.categoria.trim() || 'sin categoria',
            precio: precioConPrefijo.startsWith('$') ? precioConPrefijo : `$ ${precioConPrefijo || '0'}`,
            cantidad: Number.isNaN(cantidad) ? 0 : cantidad,
            vendidos: 0,
            imagen: imagenSeleccionada || `https://picsum.photos/seed/${Date.now()}/120/80`,
        };
    };

    const guardarProducto = (mantenerFormularioAbierto: boolean) => {
        if (!formularioProducto.nombre.trim()) {
            return;
        }

        const nuevoProducto = crearProductoDesdeFormulario();

        setProductos((productosActuales) => [nuevoProducto, ...productosActuales]);
        setPaginaActual(1);

        if (mantenerFormularioAbierto) {
            limpiarFormulario();
            return;
        }

        cancelarAgregarProducto();
    };

    const manejarSeleccionImagen = (evento: ChangeEvent<HTMLInputElement>) => {
        const archivo = evento.target.files?.[0];

        if (!archivo) {
            return;
        }

        if (imagenSeleccionada.startsWith('blob:')) {
            URL.revokeObjectURL(imagenSeleccionada);
        }

        const urlTemporal = URL.createObjectURL(archivo);
        setImagenSeleccionada(urlTemporal);
    };

    return (
        <section className={`inventarioVista ${vistaAgregarProducto ? 'inventarioVistaAgregar' : ''}`.trim()} id="inventario">
                {vistaAgregarProducto ? (
                    <header className="inventarioEncabezadoAgregar">
                        <h2 className="inventarioTituloAgregar">Añadir nuevo producto</h2>
                        <button className="inventarioBotonCancelar" type="button" onClick={cancelarAgregarProducto}>
                            Cancelar
                        </button>
                        <UsuarioMenu className="inventarioUsuarioMenu" ariaLabel="Perfil del usuario" />
                    </header>
                ) : (
                    <header className="inventarioEncabezado">
                        <h2 className="inventarioTitulo">INVENTARIO</h2>

                        <label
                            className={`inventarioBuscador ${busquedaMovilActiva ? 'inventarioBuscadorMovilActivo' : ''}`}
                        >
                            <button
                                type="button"
                                className="inventarioBuscadorBoton"
                                aria-label="Abrir busqueda"
                                onClick={activarBusquedaMovil}
                            >
                                <span className="inventarioBuscadorIcono" aria-hidden="true">
                                <svg viewBox="0 0 24 24" focusable="false">
                                    <circle cx="11" cy="11" r="6" />
                                    <line x1="15.5" y1="15.5" x2="21" y2="21" />
                                </svg>
                                </span>
                            </button>
                            <input
                                ref={inputBusquedaRef}
                                type="search"
                                placeholder="Search"
                                className="inventarioInput"
                                aria-label="Buscar producto"
                                value={textoBusqueda}
                                onBlur={cerrarBusquedaMovilSiVacia}
                                onKeyDown={(event) => {
                                    if (event.key === 'Escape') {
                                        cerrarBusquedaMovilSiVacia();
                                    }
                                }}
                                onChange={(event) => {
                                    setTextoBusqueda(event.target.value);
                                    setPaginaActual(1);
                                }}
                            />
                        </label>

                        <button className="inventarioBotonAgregar" type="button" onClick={abrirVistaAgregarProducto}>
                            <span className="inventarioBotonIcono" aria-hidden="true">+</span>
                            Añadir nuevo producto
                        </button>

                        <UsuarioMenu className="inventarioUsuarioMenu" ariaLabel="Perfil del usuario" />
                    </header>
                )}

                {vistaAgregarProducto ? (
                    <section className="inventarioPanel inventarioPanelAgregar">
                        <form
                            className="inventarioFormularioAgregar"
                            onSubmit={(event) => {
                                event.preventDefault();
                                guardarProducto(false);
                            }}
                        >
                            <input
                                className="inventarioFormularioInput"
                                type="text"
                                placeholder="Nombre del producto"
                                value={formularioProducto.nombre}
                                onChange={(event) => actualizarCampoFormulario('nombre', event.target.value)}
                                required
                            />
                            <input
                                className="inventarioFormularioInput"
                                type="text"
                                placeholder="Referencia/codigo"
                                value={formularioProducto.referencia}
                                onChange={(event) => actualizarCampoFormulario('referencia', event.target.value)}
                            />
                            <input
                                className="inventarioFormularioInput"
                                type="text"
                                placeholder="categoria"
                                value={formularioProducto.categoria}
                                onChange={(event) => actualizarCampoFormulario('categoria', event.target.value)}
                            />
                            <input
                                className="inventarioFormularioInput"
                                type="text"
                                placeholder="Precio de venta"
                                value={formularioProducto.precio}
                                onChange={(event) => actualizarCampoFormulario('precio', event.target.value)}
                            />
                            <input
                                className="inventarioFormularioInput"
                                type="number"
                                min="0"
                                placeholder="cantidad en stock"
                                value={formularioProducto.cantidad}
                                onChange={(event) => actualizarCampoFormulario('cantidad', event.target.value)}
                            />

                            <div className="inventarioFilaImagen">
                                <input
                                    className="inventarioFormularioInput inventarioFormularioInputDescripcion"
                                    type="text"
                                    placeholder="descripcion (opcional)"
                                    value={formularioProducto.descripcion}
                                    onChange={(event) => actualizarCampoFormulario('descripcion', event.target.value)}
                                />

                                <p className="inventarioTextoImagen">Imagen del producto:</p>

                                <div className="inventarioCargaImagenContenedor">
                                    <button
                                        type="button"
                                        className="inventarioBotonSubirImagen"
                                        onClick={() => inputImagenRef.current?.click()}
                                    >
                                        Subir imagen
                                        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                                            <path d="M7 17a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5-1.7A3.8 3.8 0 0 1 18 17" />
                                            <path d="M12 11v8" />
                                            <path d="m8.9 13.8 3.1-3.1 3.1 3.1" />
                                        </svg>
                                    </button>

                                    <input
                                        ref={inputImagenRef}
                                        type="file"
                                        accept="image/*"
                                        className="inventarioInputArchivo"
                                        onChange={manejarSeleccionImagen}
                                    />
                                </div>
                            </div>

                            <div className="inventarioAccionesFormulario">
                                <button className="inventarioBotonGuardar" type="submit">
                                    Guardar producto
                                </button>

                                <button
                                    className="inventarioBotonGuardar"
                                    type="button"
                                    onClick={() => guardarProducto(true)}
                                >
                                    Guardar y añadir otro
                                </button>
                            </div>
                        </form>
                    </section>
                ) : (
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

                    <div className="inventarioListaMovil" aria-label="Lista de productos en movil">
                        <div className="inventarioListaMovilEncabezado" aria-hidden="true">
                            <span className="inventarioListaMovilCelda inventarioListaMovilCeldaAccion" />
                            <span className="inventarioListaMovilCelda inventarioListaMovilCeldaNombre">nombre</span>
                            <span className="inventarioListaMovilCelda inventarioListaMovilCeldaMenu" />
                        </div>

                        {productosVisibles.map((producto) => {
                            const estaExpandido = productoExpandidoId === producto.id;

                            return (
                                <article key={`movil-${producto.id}`} className="inventarioMovilItem">
                                    <div className="inventarioMovilFilaPrincipal">
                                        <button
                                            className="inventarioMovilAlternar"
                                            type="button"
                                            aria-label={`${estaExpandido ? 'Ocultar' : 'Mostrar'} detalle de ${producto.nombre}`}
                                            aria-expanded={estaExpandido}
                                            onClick={() => alternarExpandido(producto.id)}
                                        >
                                            <svg viewBox="0 0 24 24" focusable="false">
                                                <path d="m9 6 6 6-6 6" />
                                            </svg>
                                        </button>

                                        <p className="inventarioMovilNombre">{producto.nombre}</p>

                                        <button
                                            className="inventarioMovilMenu"
                                            type="button"
                                            aria-label={`Opciones para ${producto.nombre}`}
                                        >
                                            <span />
                                            <span />
                                            <span />
                                        </button>
                                    </div>

                                    {estaExpandido && (
                                        <div className="inventarioMovilDetalle">
                                            <p>
                                                <span>Codigo:</span> {producto.id}
                                            </p>
                                            <p>
                                                <span>categoria</span> {producto.categoria}
                                            </p>
                                            <p>
                                                <span>Precio</span> {producto.precio}
                                            </p>
                                            <p>
                                                <span>cantidad</span> {producto.cantidad}
                                            </p>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
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
                )}
        </section>
    );
}

export default Inventario;

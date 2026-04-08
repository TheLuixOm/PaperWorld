import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UsuarioMenu from '../../empleado/Barras/UsuarioMenu';
import { productosIniciales } from '../../empleado/datosInventario';
import MenuLateralMovil from '../componentes/MenuLateralMovil';
import ProductoExpandidoMov, { type ProductoExpandidoMovData } from '../componentes/ProductoExpandidoMov';
import clipAzul from '../../../images/Clip_azul.svg';
import '../inicio/InicioClienteMov.css';
import './CatalogoMov.css';

type ProductoMovil = {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagen: string;
};

type OrdenCatalogo = 'relevancia' | 'precio_desc' | 'precio_asc' | 'nombre_asc' | 'nombre_desc';

function parsearPrecio(precio: string) {
  const limpio = precio.replace(/[^0-9,.-]/g, '').replace(/,/g, '');
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : 0;
}

function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function levenshtein(a: string, b: string) {
  if (a === b) {
    return 0;
  }

  const alen = a.length;
  const blen = b.length;
  if (!alen) {
    return blen;
  }
  if (!blen) {
    return alen;
  }

  const prev = new Array<number>(blen + 1);
  const cur = new Array<number>(blen + 1);

  for (let j = 0; j <= blen; j += 1) {
    prev[j] = j;
  }

  for (let i = 1; i <= alen; i += 1) {
    cur[0] = i;
    const ca = a.charCodeAt(i - 1);

    for (let j = 1; j <= blen; j += 1) {
      const cb = b.charCodeAt(j - 1);
      const cost = ca === cb ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }

    for (let j = 0; j <= blen; j += 1) {
      prev[j] = cur[j];
    }
  }

  return prev[blen];
}

function puntajeBusquedaAproximada(consulta: string, campos: string[]) {
  const q = normalizarTexto(consulta);
  if (!q) {
    return 0;
  }

  const textos = campos.map((c) => normalizarTexto(c)).filter(Boolean);
  if (!textos.length) {
    return null;
  }

  for (const t of textos) {
    if (t.includes(q)) {
      return 0;
    }
  }

  const palabras = textos
    .flatMap((t) => t.split(/[^\p{L}\p{N}]+/gu))
    .filter(Boolean);

  const umbral = q.length <= 4 ? 1 : q.length <= 7 ? 2 : 3;
  let mejor = Number.POSITIVE_INFINITY;
  for (const palabra of palabras) {
    mejor = Math.min(mejor, levenshtein(q, palabra));
    if (mejor === 0) {
      break;
    }
  }

  if (mejor <= umbral) {
    return 1 + mejor;
  }

  return null;
}

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

function IconoFiltro() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}

function IconoOrdenar() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M8 6h13" />
      <path d="M8 12h10" />
      <path d="M8 18h7" />
      <path d="M3 7l2-2 2 2" />
      <path d="M5 5v14" />
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

function CatalogoMov() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [favoritos, setFavoritos] = useState<Record<string, boolean>>({});
  const [productoExpandido, setProductoExpandido] = useState<ProductoExpandidoMovData | null>(null);
  const [busquedaCatalogo, setBusquedaCatalogo] = useState('');
  const [sugerenciasAbiertas, setSugerenciasAbiertas] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState<'filtros' | 'orden' | null>(null);
  const [orden, setOrden] = useState<OrdenCatalogo>('relevancia');
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<Set<string>>(() => new Set());
  const buscadorRef = useRef<HTMLDivElement | null>(null);
  const inputBusquedaRef = useRef<HTMLInputElement | null>(null);
  const controlesRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [offsetFab, setOffsetFab] = useState(16);

  const productos = useMemo<ProductoMovil[]>(() => {
    return productosIniciales.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      descripcion: p.nombre,
      categoria: p.categoria,
      precio: parsearPrecio(p.precio),
      imagen: p.imagen,
    }));
  }, []);

  const categorias = useMemo(() => {
    const unicas = new Set(productos.map((p) => p.categoria).filter(Boolean));
    return Array.from(unicas).sort((a, b) => a.localeCompare(b));
  }, [productos]);

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

  useEffect(() => {
    const alPointerDown = (event: PointerEvent) => {
      const contenedor = buscadorRef.current;
      if (!contenedor) {
        return;
      }

      const objetivo = event.target;
      if (objetivo instanceof Node && !contenedor.contains(objetivo)) {
        setSugerenciasAbiertas(false);
      }

      const controles = controlesRef.current;
      if (controles && objetivo instanceof Node && !controles.contains(objetivo)) {
        setPanelAbierto(null);
      }
    };

    const alKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSugerenciasAbiertas(false);
        setPanelAbierto(null);
      }
    };

    document.addEventListener('pointerdown', alPointerDown);
    document.addEventListener('keydown', alKeyDown);

    return () => {
      document.removeEventListener('pointerdown', alPointerDown);
      document.removeEventListener('keydown', alKeyDown);
    };
  }, []);

  const abrirProducto = (producto: ProductoMovil) => {
    setProductoExpandido({
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen: producto.imagen,
    });
  };

  const productosConScore = useMemo(() => {
    const consulta = busquedaCatalogo.trim();
    const filtradosPorCategoria = categoriasSeleccionadas.size
      ? productos.filter((p) => categoriasSeleccionadas.has(p.categoria))
      : productos;

    if (!consulta) {
      return filtradosPorCategoria.map((p) => ({ producto: p, score: 0 }));
    }

    return filtradosPorCategoria
      .map((producto) => ({
        producto,
        score: puntajeBusquedaAproximada(consulta, [producto.descripcion, producto.nombre, producto.categoria, producto.id]),
      }))
      .filter((item): item is { producto: ProductoMovil; score: number } => item.score !== null);
  }, [busquedaCatalogo, productos, categoriasSeleccionadas]);

  const productosFiltrados = useMemo(() => {
    const consulta = busquedaCatalogo.trim();
    const base = [...productosConScore];

    if (orden === 'relevancia') {
      if (consulta) {
        base.sort((a, b) => a.score - b.score);
      }
      return base.map((x) => x.producto);
    }

    const lista = base.map((x) => x.producto);
    if (orden === 'precio_desc') {
      lista.sort((a, b) => b.precio - a.precio);
    } else if (orden === 'precio_asc') {
      lista.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'nombre_asc') {
      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === 'nombre_desc') {
      lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    return lista;
  }, [busquedaCatalogo, productosConScore, orden]);

  const sugerencias = useMemo(() => {
    const consulta = busquedaCatalogo.trim();
    if (!consulta) {
      return [] as ProductoMovil[];
    }

    return [...productosConScore]
      .sort((a, b) => a.score - b.score)
      .slice(0, 6)
      .map((x) => x.producto);
  }, [busquedaCatalogo, productosConScore]);

  const mostrarSugerencias = sugerenciasAbiertas && busquedaCatalogo.trim().length > 0 && sugerencias.length > 0;

  return (
    <div className="inicioClienteMov catalogoMov" id="catalogo-cliente-mov">
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
            end
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

        <div className="catalogoMovBusquedaWrap" ref={buscadorRef}>
          <section className="inicioClienteMovBusqueda" aria-label="Buscar">
            <span className="inicioClienteMovBusquedaIcono" aria-hidden="true">
              <IconoLupa />
            </span>
            <input
              className="inicioClienteMovBusquedaInput"
              type="search"
              placeholder="Buscar producto"
              aria-label="Buscar producto"
              ref={inputBusquedaRef}
              value={busquedaCatalogo}
              onFocus={() => setSugerenciasAbiertas(true)}
              onChange={(e) => {
                setBusquedaCatalogo(e.target.value);
                setSugerenciasAbiertas(true);
              }}
            />
          </section>

          {mostrarSugerencias && (
            <div className="catalogoMovSugerencias" role="listbox" aria-label="Sugerencias">
              {sugerencias.map((producto) => (
                <button
                  key={producto.id}
                  type="button"
                  className="catalogoMovSugerencia"
                  role="option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    abrirProducto(producto);
                    setSugerenciasAbiertas(false);
                    inputBusquedaRef.current?.focus();
                  }}
                >
                  <span className="catalogoMovSugerenciaNombre">{producto.descripcion || producto.nombre}</span>
                  <span className="catalogoMovSugerenciaPrecio">AED {producto.precio.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="catalogoMovControlesWrap" ref={controlesRef}>
          <section className="catalogoMovControles" aria-label="Controles">
            <button
              type="button"
              className={`catalogoMovControl ${panelAbierto === 'filtros' ? 'catalogoMovControlActivo' : ''}`}
              aria-expanded={panelAbierto === 'filtros'}
              aria-controls="catalogo-mov-filtros"
              onClick={() => {
                setPanelAbierto((prev) => (prev === 'filtros' ? null : 'filtros'));
                setSugerenciasAbiertas(false);
              }}
            >
              <span className="catalogoMovControlIcono" aria-hidden="true">
                <IconoFiltro />
              </span>
              <span>Filtrar</span>
            </button>
            <button
              type="button"
              className={`catalogoMovControl ${panelAbierto === 'orden' ? 'catalogoMovControlActivo' : ''}`}
              aria-expanded={panelAbierto === 'orden'}
              aria-controls="catalogo-mov-orden"
              onClick={() => {
                setPanelAbierto((prev) => (prev === 'orden' ? null : 'orden'));
                setSugerenciasAbiertas(false);
              }}
            >
              <span className="catalogoMovControlIcono" aria-hidden="true">
                <IconoOrdenar />
              </span>
              <span>Ordenar</span>
            </button>
          </section>

          {panelAbierto === 'filtros' && (
            <section className="catalogoMovPanel" id="catalogo-mov-filtros" aria-label="Filtros">
              <header className="catalogoMovPanelHeader">
                <h3 className="catalogoMovPanelTitle">Categoria</h3>
                <button
                  type="button"
                  className="catalogoMovPanelAll"
                  onClick={() => setCategoriasSeleccionadas(new Set())}
                >
                  ALL
                </button>
              </header>

              <div className="catalogoMovPanelLista" role="list">
                {categorias.map((categoria) => (
                  <label key={categoria} className="catalogoMovOpcion" role="listitem">
                    <input
                      type="checkbox"
                      checked={categoriasSeleccionadas.has(categoria)}
                      onChange={(e) => {
                        setCategoriasSeleccionadas((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) {
                            next.add(categoria);
                          } else {
                            next.delete(categoria);
                          }
                          return next;
                        });
                      }}
                    />
                    <span className="catalogoMovOpcionCaja" aria-hidden="true" />
                    <span className="catalogoMovOpcionTexto">{categoria}</span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {panelAbierto === 'orden' && (
            <section className="catalogoMovPanel" id="catalogo-mov-orden" aria-label="Ordenar">
              <header className="catalogoMovPanelHeader">
                <h3 className="catalogoMovPanelTitle">Ordenar</h3>
                <button
                  type="button"
                  className="catalogoMovPanelAll"
                  onClick={() => {
                    setOrden('relevancia');
                    setPanelAbierto(null);
                  }}
                >
                  ALL
                </button>
              </header>

              <div className="catalogoMovPanelLista" role="list">
                <label className="catalogoMovOpcion" role="listitem">
                  <input
                    type="radio"
                    name="orden-catalogo-mov"
                    checked={orden === 'precio_desc'}
                    onChange={() => {
                      setOrden('precio_desc');
                      setPanelAbierto(null);
                    }}
                  />
                  <span className="catalogoMovOpcionCaja" aria-hidden="true" />
                  <span className="catalogoMovOpcionTexto">Precio (mayor a menor)</span>
                </label>

                <label className="catalogoMovOpcion" role="listitem">
                  <input
                    type="radio"
                    name="orden-catalogo-mov"
                    checked={orden === 'precio_asc'}
                    onChange={() => {
                      setOrden('precio_asc');
                      setPanelAbierto(null);
                    }}
                  />
                  <span className="catalogoMovOpcionCaja" aria-hidden="true" />
                  <span className="catalogoMovOpcionTexto">Precio (menor a mayor)</span>
                </label>

                <label className="catalogoMovOpcion" role="listitem">
                  <input
                    type="radio"
                    name="orden-catalogo-mov"
                    checked={orden === 'nombre_asc'}
                    onChange={() => {
                      setOrden('nombre_asc');
                      setPanelAbierto(null);
                    }}
                  />
                  <span className="catalogoMovOpcionCaja" aria-hidden="true" />
                  <span className="catalogoMovOpcionTexto">Nombre (A-Z)</span>
                </label>

                <label className="catalogoMovOpcion" role="listitem">
                  <input
                    type="radio"
                    name="orden-catalogo-mov"
                    checked={orden === 'nombre_desc'}
                    onChange={() => {
                      setOrden('nombre_desc');
                      setPanelAbierto(null);
                    }}
                  />
                  <span className="catalogoMovOpcionCaja" aria-hidden="true" />
                  <span className="catalogoMovOpcionTexto">Nombre (Z-A)</span>
                </label>
              </div>
            </section>
          )}
        </div>

        <section className="catalogoMovGrid" aria-label="Productos" role="list">
          {productosFiltrados.map((producto) => (
            <article
              key={producto.id}
              className="catalogoMovCard"
              role="listitem"
              onClick={() => abrirProducto(producto)}
            >
              <div className="catalogoMovCardMarco">
                <button
                  type="button"
                  className={`catalogoMovFav ${favoritos[producto.id] ? 'catalogoMovFavActiva' : ''}`}
                  aria-label="Favorito"
                  aria-pressed={!!favoritos[producto.id]}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFavoritos((prev) => ({ ...prev, [producto.id]: !prev[producto.id] }));
                  }}
                >
                  <IconoCorazon />
                </button>

                <div className="catalogoMovImagen">
                  <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                </div>

                <button
                  type="button"
                  className="catalogoMovMiniCarrito"
                  aria-label="Agregar al carrito"
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconoCarrito />
                </button>
              </div>

              <div className="catalogoMovInfo">
                <p className="catalogoMovNombre">{producto.descripcion}</p>
                <p className="catalogoMovPrecio">
                  <span className="catalogoMovPrecioActual">AED {producto.precio.toFixed(2)}</span>
                </p>
              </div>
            </article>
          ))}
        </section>

        <footer ref={footerRef} className="inicioClienteMovFooter" aria-label="Footer" />
      </main>

      <Link
        to="/cliente/carrito"
        className="catalogoMovFab"
        style={{ bottom: `${offsetFab}px` }}
        aria-label="Abrir carrito"
      >
        <span className="catalogoMovFabIcono" aria-hidden="true">
          <IconoCarrito />
        </span>
        <span className="catalogoMovFabPlus" aria-hidden="true">
          +
        </span>
      </Link>
    </div>
  );
}

export default CatalogoMov;

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UsuarioMenu from '../../empleado/UsuarioMenu';
import { productosIniciales } from '../../empleado/datosInventario';
import ProductoExpandidoPc, { type ProductoExpandidoPcData } from '../componentes/ProductoExpandidoPc';
import clipAzul from '../../../images/Clip_azul.svg';
import '../inicio/InicioCliente.css';
import './CatalogoCliente.css';

type ProductoCatalogo = {
  id: string;
  nombre: string;
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
  const [productoExpandido, setProductoExpandido] = useState<ProductoExpandidoPcData | null>(null);
  const [busquedaCatalogo, setBusquedaCatalogo] = useState('');
  const [sugerenciasAbiertas, setSugerenciasAbiertas] = useState(false);
  const [orden, setOrden] = useState<OrdenCatalogo>('relevancia');
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<Set<string>>(() => new Set());
  const buscadorRef = useRef<HTMLElement | null>(null);
  const inputBusquedaRef = useRef<HTMLInputElement | null>(null);

  const productosCatalogo = useMemo<ProductoCatalogo[]>(() => {
    return productosIniciales.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: parsearPrecio(p.precio),
      imagen: p.imagen,
    }));
  }, []);

  const categorias = useMemo(() => {
    const unicas = new Set(productosCatalogo.map((p) => p.categoria).filter(Boolean));
    return Array.from(unicas).sort((a, b) => a.localeCompare(b));
  }, [productosCatalogo]);

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
    };

    const alKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSugerenciasAbiertas(false);
      }
    };

    document.addEventListener('pointerdown', alPointerDown);
    document.addEventListener('keydown', alKeyDown);

    return () => {
      document.removeEventListener('pointerdown', alPointerDown);
      document.removeEventListener('keydown', alKeyDown);
    };
  }, []);

  const abrirProducto = (producto: ProductoCatalogo) => {
    setProductoExpandido({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
    });
  };

  const productosConScore = useMemo(() => {
    const consulta = busquedaCatalogo.trim();
    const filtradosPorCategoria = categoriasSeleccionadas.size
      ? productosCatalogo.filter((p) => categoriasSeleccionadas.has(p.categoria))
      : productosCatalogo;

    if (!consulta) {
      return filtradosPorCategoria.map((p) => ({ producto: p, score: 0 }));
    }

    return filtradosPorCategoria
      .map((producto) => ({
        producto,
        score: puntajeBusquedaAproximada(consulta, [producto.nombre, producto.categoria, producto.id]),
      }))
      .filter((item): item is { producto: ProductoCatalogo; score: number } => item.score !== null);
  }, [busquedaCatalogo, categoriasSeleccionadas, productosCatalogo]);

  const productosFiltrados = useMemo(() => {
    const consulta = busquedaCatalogo.trim();

    const base = [...productosConScore];

    if (orden === 'relevancia') {
      if (consulta) {
        base.sort((a, b) => a.score - b.score);
      }
      return base.map((x) => x.producto);
    }

    const productos = base.map((x) => x.producto);
    if (orden === 'precio_desc') {
      productos.sort((a, b) => b.precio - a.precio);
    } else if (orden === 'precio_asc') {
      productos.sort((a, b) => a.precio - b.precio);
    } else if (orden === 'nombre_asc') {
      productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (orden === 'nombre_desc') {
      productos.sort((a, b) => b.nombre.localeCompare(a.nombre));
    }

    return productos;
  }, [busquedaCatalogo, productosConScore, orden]);

  const sugerencias = useMemo(() => {
    const consulta = busquedaCatalogo.trim();
    if (!consulta) {
      return [] as ProductoCatalogo[];
    }

    return [...productosConScore]
      .sort((a, b) => a.score - b.score)
      .slice(0, 6)
      .map((x) => x.producto);
  }, [busquedaCatalogo, productosConScore]);

  const mostrarSugerencias = sugerenciasAbiertas && busquedaCatalogo.trim().length > 0 && sugerencias.length > 0;

  return (
    <div className="inicioCliente catalogoCliente" id="catalogo-cliente">
      <ProductoExpandidoPc
        abierto={!!productoExpandido}
        producto={productoExpandido}
        alCerrar={() => setProductoExpandido(null)}
      />
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

        <section className="catalogoClienteBusqueda" aria-label="Busqueda de catalogo" ref={buscadorRef}>
          <span className="catalogoClienteBusquedaIcono" aria-hidden="true">
            <IconoLupa />
          </span>
          <input
            className="catalogoClienteBusquedaInput"
            type="search"
            placeholder="Catalogo, brand, etc..."
            aria-label="Buscar en catalogo"
            ref={inputBusquedaRef}
            value={busquedaCatalogo}
            onFocus={() => setSugerenciasAbiertas(true)}
            onChange={(e) => {
              setBusquedaCatalogo(e.target.value);
              setSugerenciasAbiertas(true);
            }}
          />

          {mostrarSugerencias && (
            <div className="catalogoClienteSugerencias" role="listbox" aria-label="Sugerencias">
              {sugerencias.map((producto) => (
                <button
                  key={producto.id}
                  type="button"
                  className="catalogoClienteSugerencia"
                  role="option"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    abrirProducto(producto);
                    setSugerenciasAbiertas(false);
                    inputBusquedaRef.current?.focus();
                  }}
                >
                  <span className="catalogoClienteSugerenciaNombre">{producto.nombre}</span>
                  <span className="catalogoClienteSugerenciaPrecio">AED {producto.precio.toFixed(2)}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="catalogoClienteCuerpo" aria-label="Catalogo">
          <aside className="catalogoClienteFiltros" aria-label="Filtros">
            <article className="catalogoClienteFiltroBloque" aria-label="Filtro categoria">
              <header className="catalogoClienteFiltroEncabezado">
                <h3 className="catalogoClienteFiltroTitulo">Categoria</h3>
                <button
                  type="button"
                  className="catalogoClienteFiltroAll"
                  onClick={() => setCategoriasSeleccionadas(new Set())}
                >
                  ALL
                </button>
              </header>

              <div className="catalogoClienteFiltroLista" role="list">
                {categorias.map((categoria, index) => (
                  <label key={`${categoria}-${index}`} className="catalogoClienteCheck" role="listitem">
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
                    <span className="catalogoClienteCheckCaja" aria-hidden="true" />
                    <span className="catalogoClienteCheckTexto">{categoria}</span>
                  </label>
                ))}
              </div>
            </article>

            <article className="catalogoClienteFiltroBloque" aria-label="Ordenar">
              <header className="catalogoClienteFiltroEncabezado">
                <h3 className="catalogoClienteFiltroTitulo">Ordenar</h3>
                <button
                  type="button"
                  className="catalogoClienteFiltroAll"
                  onClick={() => setOrden('relevancia')}
                >
                  ALL
                </button>
              </header>

              <div className="catalogoClienteFiltroLista" role="list">
                <label className="catalogoClienteCheck" role="listitem">
                  <input
                    type="radio"
                    name="orden-catalogo"
                    checked={orden === 'precio_desc'}
                    onChange={() => setOrden('precio_desc')}
                  />
                  <span className="catalogoClienteCheckCaja" aria-hidden="true" />
                  <span className="catalogoClienteCheckTexto">Precio (mayor a menor)</span>
                </label>

                <label className="catalogoClienteCheck" role="listitem">
                  <input
                    type="radio"
                    name="orden-catalogo"
                    checked={orden === 'precio_asc'}
                    onChange={() => setOrden('precio_asc')}
                  />
                  <span className="catalogoClienteCheckCaja" aria-hidden="true" />
                  <span className="catalogoClienteCheckTexto">Precio (menor a mayor)</span>
                </label>

                <label className="catalogoClienteCheck" role="listitem">
                  <input
                    type="radio"
                    name="orden-catalogo"
                    checked={orden === 'nombre_asc'}
                    onChange={() => setOrden('nombre_asc')}
                  />
                  <span className="catalogoClienteCheckCaja" aria-hidden="true" />
                  <span className="catalogoClienteCheckTexto">Nombre (A-Z)</span>
                </label>

                <label className="catalogoClienteCheck" role="listitem">
                  <input
                    type="radio"
                    name="orden-catalogo"
                    checked={orden === 'nombre_desc'}
                    onChange={() => setOrden('nombre_desc')}
                  />
                  <span className="catalogoClienteCheckCaja" aria-hidden="true" />
                  <span className="catalogoClienteCheckTexto">Nombre (Z-A)</span>
                </label>
              </div>
            </article>
          </aside>

          <section className="catalogoClienteResultados" aria-label="Resultados">
            <div className="catalogoClienteGrid" role="list">
              {productosFiltrados.map((producto) => (
                <article key={producto.id} className="catalogoClienteProducto" role="listitem">
                  <div className="catalogoClienteProductoMarco" onClick={() => abrirProducto(producto)}>
                    <div className="catalogoClienteProductoImagen">
                      <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
                    </div>

                    <button
                      type="button"
                      className="catalogoClienteProductoCarrito"
                      aria-label="Agregar al carrito"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconoCarrito />
                    </button>
                  </div>

                  <div className="catalogoClienteProductoInfo">
                    <p className="catalogoClienteProductoNombre">{producto.nombre}</p>
                    <p className="catalogoClienteProductoPrecio">
                      <span className="catalogoClienteProductoPrecioActual">AED {producto.precio.toFixed(2)}</span>
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

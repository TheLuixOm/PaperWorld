import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import clipAzul from '../../images/Clip_azul.svg';
import './Empleado.css';

type TipoIcono =
  | 'dashboard'
  | 'inventario'
  | 'ventas'
  | 'proveedores'
  | 'reportes'
  | 'ayuda'
  | 'ajustes';

const opcionesMenu = [
  { ruta: '/dashboard', icono: 'dashboard' as TipoIcono, etiqueta: 'Inicio' },
  { ruta: '/inventario', icono: 'inventario' as TipoIcono, etiqueta: 'Inventario' },
  { ruta: '/ventas', icono: 'ventas' as TipoIcono, etiqueta: 'Ordenes de venta' },
  { ruta: '/proveedores', icono: 'proveedores' as TipoIcono, etiqueta: 'Proveedores' },
  { ruta: '/reportes', icono: 'reportes' as TipoIcono, etiqueta: 'Reportes' },
];

const opcionesSoporte = [
  { ruta: '/ayuda', icono: 'ayuda' as TipoIcono, etiqueta: 'Ayuda' },
  { ruta: '/ajustes', icono: 'ajustes' as TipoIcono, etiqueta: 'Configuracion' },
];

function IconoSeccion({ tipo }: { tipo: TipoIcono }) {
  if (tipo === 'dashboard') {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="11" width="7" height="10" rx="1.5" />
        <rect x="3" y="12" width="7" height="9" rx="1.5" />
      </svg>
    );
  }

  if (tipo === 'inventario') {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M4 7.5 12 3l8 4.5-8 4.5z" />
        <path d="M4 12.5 12 17l8-4.5" />
        <path d="M4 17l8 4 8-4" />
      </svg>
    );
  }

  if (tipo === 'ventas') {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="8" cy="19" r="1.6" />
        <circle cx="17" cy="19" r="1.6" />
        <path d="M3 5h2l2.3 9.2h10.2l2-6.5H6.1" />
      </svg>
    );
  }

  if (tipo === 'proveedores') {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M4 8.5h16v9.5H4z" />
        <path d="M8 8.5V6.7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.8" />
        <path d="M4 13h16" />
      </svg>
    );
  }

  if (tipo === 'reportes') {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M4 20V4" />
        <path d="M4 20h16" />
        <path d="m7 15 3-4 3 2 4-6" />
      </svg>
    );
  }

  if (tipo === 'ayuda') {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.6 9.2a2.5 2.5 0 0 1 4.7 1.3c0 1.4-1.2 2-1.9 2.5-.7.5-1 1-1 1.8" />
        <circle cx="12" cy="17.8" r="0.8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.2 12a7.2 7.2 0 0 0 .1-1l2-1.5-2-3.4-2.4 1a7.6 7.6 0 0 0-1.8-1l-.4-2.6h-4l-.4 2.6a7.6 7.6 0 0 0-1.8 1l-2.4-1-2 3.4L4.7 11a7.2 7.2 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a7.6 7.6 0 0 0 1.8 1l.4 2.6h4l.4-2.6a7.6 7.6 0 0 0 1.8-1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1z" />
    </svg>
  );
}

function Empleado() {
  const [estaColapsado, setEstaColapsado] = useState(false);

  const alternarSidebar = () => {
    setEstaColapsado((estadoPrevio) => !estadoPrevio);
  };

  const abrirSidebar = () => {
    setEstaColapsado(false);
  };

  return (
    <main className={`empleadoLayout ${estaColapsado ? 'empleadoLayoutColapsado' : ''}`}>
      <aside className="empleadoSidebar" aria-label="Navegacion del empleado">
        <div className="empleadoMarca">
          <h1 className="empleadoLogo">Paper world</h1>
          <button
            type="button"
            className="empleadoBotonClip"
            onClick={alternarSidebar}
            aria-label={estaColapsado ? 'Expandir menu lateral' : 'Contraer menu lateral'}
          >
            <img className="empleadoIconoClip" src={clipAzul} alt="Clip azul" />
          </button>
        </div>

        <nav className="empleadoMenu">
          {opcionesMenu.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              onClick={abrirSidebar}
              className={({ isActive }) =>
                `empleadoMenuItem ${isActive ? 'empleadoMenuItemActivo' : ''}`
              }
            >
              <span className="empleadoMenuIcono" aria-hidden="true">
                <IconoSeccion tipo={opcion.icono} />
              </span>
              <span className="empleadoTextoItem">{opcion.etiqueta}</span>
            </NavLink>
          ))}
        </nav>

        <section className="empleadoSoporte" aria-label="Soporte">
          <p className="empleadoTituloSeccion">SOPORTE</p>
          {opcionesSoporte.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              onClick={abrirSidebar}
              className="empleadoMenuItem"
            >
              <span className="empleadoMenuIcono" aria-hidden="true">
                <IconoSeccion tipo={opcion.icono} />
              </span>
              <span className="empleadoTextoItem">{opcion.etiqueta}</span>
            </NavLink>
          ))}
        </section>
      </aside>

      <section className="empleadoContenido">
        <Outlet />
      </section>
    </main>
  );
}

export default Empleado;

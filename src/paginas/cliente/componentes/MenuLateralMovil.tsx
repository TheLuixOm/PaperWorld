import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import clipAzul from '../../../images/Clip_azul.svg';
import './MenuLateralMovil.css';

type MenuLateralMovilProps = {
  abierto: boolean;
  alCerrar: () => void;
};

function IconoInicio() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 10v11h14V10" />
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

function IconoCarrito() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <circle cx="9" cy="19" r="1.6" />
      <circle cx="17" cy="19" r="1.6" />
      <path d="M3 5h2l2.2 9.2h10.4l2-6.5H6.1" />
    </svg>
  );
}

function IconoHelp() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 18h.01" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-2.9 2.2-2.9 4" />
      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z" />
    </svg>
  );
}

function IconoSettings() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 15.5a3.5 3.5 0 1 0-3.5-3.5 3.5 3.5 0 0 0 3.5 3.5z" />
      <path d="M19.4 15a8.3 8.3 0 0 0 .1-1 8.3 8.3 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7.8 7.8 0 0 0-1.7-1l-.4-2.6H10l-.4 2.6a7.8 7.8 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a8.3 8.3 0 0 0-.1 1 8.3 8.3 0 0 0 .1 1l-2 1.6 2 3.4 2.4-1a7.8 7.8 0 0 0 1.7 1l.4 2.6h4.6l.4-2.6a7.8 7.8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6z" />
    </svg>
  );
}

function MenuLateralMovil({ abierto, alCerrar }: MenuLateralMovilProps) {
  const primerItemRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!abierto) {
      return;
    }

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const alTeclado = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        alCerrar();
      }
    };

    document.addEventListener('keydown', alTeclado);
    window.setTimeout(() => primerItemRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener('keydown', alTeclado);
    };
  }, [abierto, alCerrar]);

  return (
    <div
      className={`menuLateralMovil ${abierto ? 'menuLateralMovilAbierto' : ''}`}
      aria-hidden={!abierto}
    >
      <button
        type="button"
        className="menuLateralMovilOverlay"
        aria-label="Cerrar menu"
        onClick={alCerrar}
        tabIndex={abierto ? 0 : -1}
      />

      <aside className="menuLateralMovilPanel" role="dialog" aria-label="Menu">
        <div className="menuLateralMovilTop">
          <img className="menuLateralMovilClip" src={clipAzul} alt="Clip" />
        </div>

        <nav className="menuLateralMovilNav" aria-label="Navegacion principal">
          <NavLink
            ref={primerItemRef}
            to="/cliente/inicio"
            end
            className={({ isActive }) =>
              `menuLateralMovilItem ${isActive ? 'menuLateralMovilItemActivo' : ''}`
            }
            onClick={alCerrar}
          >
            <span className="menuLateralMovilIcono" aria-hidden="true">
              <IconoInicio />
            </span>
            <span className="menuLateralMovilTexto">Inicio</span>
          </NavLink>

          <NavLink
            to="/cliente/catalogo"
            className={({ isActive }) =>
              `menuLateralMovilItem ${isActive ? 'menuLateralMovilItemActivo' : ''}`
            }
            onClick={alCerrar}
          >
            <span className="menuLateralMovilIcono" aria-hidden="true">
              <IconoCatalogo />
            </span>
            <span className="menuLateralMovilTexto">Catalogo</span>
          </NavLink>

          <NavLink
            to="/cliente/carrito"
            className={({ isActive }) =>
              `menuLateralMovilItem ${isActive ? 'menuLateralMovilItemActivo' : ''}`
            }
            onClick={alCerrar}
          >
            <span className="menuLateralMovilIcono" aria-hidden="true">
              <IconoCarrito />
            </span>
            <span className="menuLateralMovilTexto">Carrito</span>
          </NavLink>
        </nav>

        <div className="menuLateralMovilSeparador" />

        <div className="menuLateralMovilBloque" aria-label="Support">
          <p className="menuLateralMovilLabel">SUPPORT</p>

          <button type="button" className="menuLateralMovilItem menuLateralMovilItemBoton" onClick={alCerrar}>
            <span className="menuLateralMovilIcono" aria-hidden="true">
              <IconoHelp />
            </span>
            <span className="menuLateralMovilTexto">Help</span>
          </button>

          <button type="button" className="menuLateralMovilItem menuLateralMovilItemBoton" onClick={alCerrar}>
            <span className="menuLateralMovilIcono" aria-hidden="true">
              <IconoSettings />
            </span>
            <span className="menuLateralMovilTexto">Settings</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default MenuLateralMovil;

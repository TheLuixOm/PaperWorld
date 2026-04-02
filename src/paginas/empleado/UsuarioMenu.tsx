import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UsuarioMenu.css';

type UsuarioMenuProps = {
  className?: string;
  ariaLabel?: string;
};

function UsuarioMenu({ className = '', ariaLabel = 'Perfil del usuario' }: UsuarioMenuProps) {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const nombreUsuarioGuardado = localStorage.getItem('paperworldUsuario')?.trim() || 'Usuario';
  const nombreMostrado = nombreUsuarioGuardado.includes('@')
    ? nombreUsuarioGuardado.split('@')[0]
    : nombreUsuarioGuardado;
  const inicial = nombreMostrado.slice(0, 1).toUpperCase();

  const cerrarSesion = () => {
    localStorage.removeItem('paperworldUsuario');
    setMostrarPerfil(false);
    navigate('/login');
  };

  useEffect(() => {
    const cerrarAlHacerClickFuera = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMostrarPerfil(false);
      }
    };

    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMostrarPerfil(false);
      }
    };

    document.addEventListener('mousedown', cerrarAlHacerClickFuera);
    document.addEventListener('keydown', cerrarConEscape);

    return () => {
      document.removeEventListener('mousedown', cerrarAlHacerClickFuera);
      document.removeEventListener('keydown', cerrarConEscape);
    };
  }, []);

  return (
    <div className={`usuarioMenu ${className}`.trim()} ref={menuRef}>
      <button
        className="usuarioMenuBoton"
        type="button"
        aria-label={ariaLabel}
        aria-expanded={mostrarPerfil}
        onClick={() => setMostrarPerfil((estadoAnterior) => !estadoAnterior)}
      >
        <span className="usuarioMenuInicial">{inicial}</span>
      </button>

      {mostrarPerfil && (
        <div className="usuarioMenuPanel" role="dialog" aria-label="Menu de usuario">
          <div className="usuarioMenuCabecera">
            <div className="usuarioMenuIdentidad">
              <div className="usuarioMenuAvatarGrande" aria-hidden="true">
                {inicial}
              </div>
              <div>
                <p className="usuarioMenuNombre">{nombreMostrado}</p>
                <p className="usuarioMenuSubtexto">Admin</p>
              </div>
            </div>
            <span className="usuarioMenuMas" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </div>

          <p className="usuarioMenuTitulo">opciones de usuario</p>

          <button type="button" className="usuarioMenuOpcion" onClick={cerrarSesion}>
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
  );
}

export default UsuarioMenu;

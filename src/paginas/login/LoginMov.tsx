import './LoginMov.css';
import loginImage from '../../images/login.jpg';

type LoginMovProps = {
  onIrRegistro?: () => void;
};

function LoginMov({ onIrRegistro }: LoginMovProps) {
  return (
    <main className="login-mov-page">
      <section className="login-mov-hero" style={{ backgroundImage: `url(${loginImage})` }}>
        <div className="login-mov-brand-card">
          <h1 className="login-mov-brand">Paper world</h1>
        </div>
      </section>

      <section className="login-mov-content">
        <form className="login-mov-card" onSubmit={(event) => event.preventDefault()}>
          <label className="login-mov-label" htmlFor="correo">
            Correo
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            className="login-mov-input"
            placeholder="Value"
            autoComplete="email"
          />

          <label className="login-mov-label" htmlFor="contrasena">
            Contraseña
          </label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            className="login-mov-input"
            placeholder="Value"
            autoComplete="current-password"
          />

          <div className="login-mov-actions" role="group" aria-label="Acciones de login">
            <button type="submit" className="login-mov-button login-mov-button-primary">
              Login
            </button>
            <button
              type="button"
              className="login-mov-button login-mov-button-secondary"
              onClick={onIrRegistro}
            >
              Registrate
            </button>
          </div>

          <button type="button" className="login-mov-forgot">
            ¿Olvido su contraseña?
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginMov;

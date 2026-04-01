import './Login.css';
import loginImage from '../../images/login.jpg';
import Clip_negro from '../../images/Clip_negro.svg';

function LoginEsc() {
	return (
		<main className="login-esc-page">
			<section className="login-esc-layout" aria-label="Login escritorio">
				<div className="login-esc-visual">
					<img
						className="login-esc-visual-image"
						src={loginImage}
						alt="Decoracion izquierda"
					/>
				</div>

				<div className="login-esc-content">
					<img
						className='icono_marca' 
						src={Clip_negro} 
						alt="Icono_Marca" />
					<header className="login-esc-header">
						<h1 className="login-esc-marca">Paper world</h1>
					</header>

					<form className="login-esc-card" onSubmit={(event) => event.preventDefault()}>
						<label className="login-esc-label" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							className="login-esc-input"
							placeholder="Value"
							autoComplete="email"
						/>

						<label className="login-esc-label" htmlFor="password">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							className="login-esc-input"
							placeholder="Value"
							autoComplete="current-password"
						/>

						<div className="login-esc-actions" role="group" aria-label="Acciones de login">
							<button type="submit" className="login-esc-button login-esc-button-primary">
								Log in
							</button>
							<button type="button" className="login-esc-button login-esc-button-secondary">
								Sign In
							</button>
						</div>

						<button type="button" className="login-esc-olvido">
							¿Olvido su contraseña?
						</button>
					</form>
				</div>
			</section>
		</main>
	);
}

export default LoginEsc;

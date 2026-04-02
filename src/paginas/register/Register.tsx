import './Register.css';
import loginImage from '../../images/login.jpg';
import Clip_negro from '../../images/Clip_negro.svg';

function RegisterEsc() {
 	return (
		<main className="register_page">
            <section className="register_layout" aria-label="Registro escritorio">
				<div className="contenido_registro">
					<img
                        className="icono_marca"
                        src={Clip_negro}
						alt="Icono_Marca" />
                    <header className="register_header">
                        <h1 className="register_marca">Paper world</h1>
                        <h2 className='register_submarca'>Regístrar una cuenta</h2>
                        <h3 className='register_descripcion'>Tienes una cuenta? <a href="/login">Inicia sesión</a></h3>
                    </header>
                    <form className="register_card" onSubmit={(event) => event.preventDefault()}>
                        <div className='misma_linea'>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    className="register_input"
                                    placeholder="Nombre"
                                    autoComplete="given-name"
                                />
                                <input
                                    id="apellido"
                                    name="apellido"
                                    type="text"
                                    className="register_input"
                                    placeholder="Apellido"
                                    autoComplete="family-name"
                                />
                        </div>
                    
                        <input
                            id="Email"
                            name="Email"
                            type="email"
                            className="register_input"
                            placeholder="Email"
                            autoComplete="email"
                        />
                
                        <input
                            id="nombre_usuario"
                            name="nombre_usuario"
                            type="text"
                            className="register_input"
                            placeholder="Nombre de usuario"
                            autoComplete="username"
                        />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="register_input"
                            placeholder="Contraseña"
                            autoComplete="new-password"
                        />

                        <input
                            id="telefono"
                            name="telefono"
                            type="tel"
                            className="register_input"
                            placeholder="Teléfono"
                            autoComplete="tel"
                        />


                        

                        <div className="register_actions" role="group" aria-label="Acciones de registro">
                            <button type="submit" className="register_button register_button_primary">
                                Registrarse
                            </button>
                            <button type="button" className="register_button register_button_secondary">
                                Volver
                            </button>
                        </div>
                    </form>
				</div>

                <div className="register_visual">
                    <img
                        className="register_visual_image"
                        src={loginImage}
                        alt="Decoracion derecha"
                    />
				</div>
			</section>
		</main>
	);
}

export default RegisterEsc;
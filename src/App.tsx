import { useEffect, useState } from 'react'
import InicioSesionEsc from './paginas/login/LoginEsc'
import InicioSesionMov from './paginas/login/LoginMov'
import RegistroMov from './paginas/register/RegisterMov'

const puntoCorteMovil = 900 

const obtenerEsMovil = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.innerWidth <= puntoCorteMovil
}

function Aplicacion() {
  const [esMovil, setEsMovil] = useState(obtenerEsMovil)
  const [vistaMovil, setVistaMovil] = useState<'login' | 'registro'>('login')

  useEffect(() => {
    const alRedimensionar = () => {
      setEsMovil(obtenerEsMovil())
    }

    window.addEventListener('resize', alRedimensionar)

    return () => {
      window.removeEventListener('resize', alRedimensionar)
    }
  }, [])

  if (!esMovil) {
    return <InicioSesionEsc />
  }

  return vistaMovil === 'login' ? (
    <InicioSesionMov onIrRegistro={() => setVistaMovil('registro')} />
  ) : (
    <RegistroMov onIrLogin={() => setVistaMovil('login')} />
  )
}

export default Aplicacion

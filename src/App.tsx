import { useEffect, useState } from 'react'
import InicioSesionEsc from './paginas/login/LoginEsc'
import InicioSesionMov from './paginas/login/LoginMov'
import RegistroEsc from './paginas/register/Register'
const puntoCorteMovil = 900 

const obtenerEsMovil = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.innerWidth <= puntoCorteMovil
}

function Aplicacion() {
  const [esMovil, setEsMovil] = useState(obtenerEsMovil)

  useEffect(() => {
    const alRedimensionar = () => {
      setEsMovil(obtenerEsMovil())
    }

    window.addEventListener('resize', alRedimensionar)

    return () => {
      window.removeEventListener('resize', alRedimensionar)
    }
  }, [])
return  <RegistroEsc />
  return esMovil ? <InicioSesionMov /> : <InicioSesionEsc />
}

export default Aplicacion

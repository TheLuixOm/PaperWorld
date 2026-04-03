import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import InicioSesionEsc from './paginas/login/LoginEsc'
import InicioSesionMov from './paginas/login/LoginMov'
import RegistroEsc from './paginas/register/Register'
import Empleado from './paginas/empleado/Empleado'
import Inventario from './paginas/empleado/Inventario'
import VistaEmpleado from './paginas/empleado/VistaEmpleado'
import Inicio from './paginas/empleado/Inicio'
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

  const elementoInicioSesion = esMovil ? <InicioSesionMov /> : <InicioSesionEsc />

  return (
    <Routes>
      <Route path="/" element={elementoInicioSesion} />
      <Route path="/login" element={elementoInicioSesion} />
      <Route path="/registro" element={<RegistroEsc />} />
      <Route element={<Empleado />}>
        <Route path="/dashboard" element={<Inicio />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ventas" element={<VistaEmpleado titulo="Ventas" />} />
        <Route path="/proveedores" element={<VistaEmpleado titulo="Proveedores" />} />
        <Route path="/reportes" element={<VistaEmpleado titulo="Reportes" />} />
        <Route path="/ayuda" element={<VistaEmpleado titulo="Ayuda" />} />
        <Route path="/ajustes" element={<VistaEmpleado titulo="Configuracion" />} />
      </Route>
      <Route path="*" element={<Navigate to="/inventario" replace />} />
    </Routes>
  )
}

export default Aplicacion

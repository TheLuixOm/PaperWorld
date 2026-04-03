import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import InicioSesionEsc from './paginas/login/LoginEsc'
import InicioSesionMov from './paginas/login/LoginMov'
import RegistroEsc from './paginas/register/Register'
import RegistroMov from './paginas/register/RegisterMov'
import Empleado from './paginas/empleado/Empleado'
import Inventario from './paginas/empleado/Inventario'
import VistaEmpleado from './paginas/empleado/VistaEmpleado'
import InicioEmpleado from './paginas/empleado/Inicio'
import InicioCliente from './paginas/cliente/inicio/InicioCliente'
import CatalogoCliente from './paginas/cliente/catalogo/Catalogo'
import CarritoCliente from './paginas/cliente/carrito/Carrito'
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
    const elementoRegistro = esMovil ? <RegistroMov /> : <RegistroEsc />

  return (
    <Routes>
      <Route path="/" element={elementoInicioSesion} />
      <Route path="/login" element={elementoInicioSesion} />
    <Route path="/registro" element={elementoRegistro} />
    <Route path="/register" element={elementoRegistro} />

      <Route path="/cliente" element={<Navigate to="/cliente/inicio" replace />} />
      <Route path="/cliente/inicio" element={<InicioCliente />} />
      <Route path="/InicioCliente" element={<InicioCliente />} />
      <Route path="/inicioCliente" element={<InicioCliente />} />
      <Route path="/cliente/catalogo" element={<CatalogoCliente />} />
      <Route path="/cliente/carrito" element={<CarritoCliente />} />
      <Route element={<Empleado />}>
        <Route path="/dashboard" element={<InicioEmpleado />} />
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

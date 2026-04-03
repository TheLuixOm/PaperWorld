type PropiedadesVistaEmpleado = {
  titulo: string;
};

function VistaEmpleado({ titulo }: PropiedadesVistaEmpleado) {
  return (
    <section className="inventarioVista">
      <header className="inventarioEncabezado">
        <h2 className="inventarioTitulo">{titulo.toUpperCase()}</h2>
      </header>

      <section className="inventarioPanel">
        <h3 className="inventarioSubtitulo">Vista en construccion</h3>
      </section>
    </section>
  );
}

export default VistaEmpleado;
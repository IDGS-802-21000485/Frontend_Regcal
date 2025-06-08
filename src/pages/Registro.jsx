import CaloriasHoy from '../Components/CaloriasHoy';
import ComidaForm from '../Components/ComidaForm';
import ListaComidas from '../Components/ListaComida';

export default function Registro() {
  const recargar = () => window.location.reload();

  return (
    <>
      <h1>Registro de alimentos 🍽️</h1>
      <CaloriasHoy />
      <ComidaForm onComidaRegistrada={recargar} />
      <ListaComidas />
    </>
  );
}

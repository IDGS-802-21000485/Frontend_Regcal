import CaloriasHoy from '../Components/CaloriasHoy';
import ComidaForm from '../Components/ComidaForm';
import ListaComidas from '../Components/ListaComida';

export default function Registro() {
  const recargar = () => window.location.reload();

  return (
    <>
      <h1>RegCal 🍽️</h1>
      <CaloriasHoy />
      <ComidaForm onComidaRegistrada={recargar} />
      <ListaComidas />
    </>
  );
}

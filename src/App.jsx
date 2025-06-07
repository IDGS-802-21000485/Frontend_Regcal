import './App.css';
import ComidaForm from './Components/ComidaForm';
import ListaComidas from './Components/ListaComida';
import CaloriasHoy from './Components/CaloriasHoy';

function App() {
  const recargar = () => window.location.reload();

  return (
    <div className="container">
      <h1>RegCal 🍽️</h1>
      <CaloriasHoy />
      <ComidaForm onComidaRegistrada={recargar} />
      <ListaComidas />
    </div>
  );
}

export default App;

import './App.css';
import ComidaForm from './components/ComidaForm';
import ListaComidas from './Components/ListaComida';
import CaloriasHoy from './components/CaloriasHoy';

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

// App.jsx
import { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Registro from './Components/Registro';
import ComidaForm from './Components/ComidaForm';
import ListaComidas from './Components/ListaComida';
import CaloriasHoy from './Components/CaloriasHoy';
import Historial from './Components/Historial';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('login'); // login, registro, app

  useEffect(() => {
    const userGuardado = JSON.parse(localStorage.getItem('usuario'));
    if (userGuardado) {
      setUsuario(userGuardado);
      setVista('app');
    }
  }, []);

  const manejarLogin = (usuarioLogeado) => {
    localStorage.setItem('usuario', JSON.stringify(usuarioLogeado));
    setUsuario(usuarioLogeado);
    setVista('app');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
    setVista('login');
  };

  if (vista === 'login') return <Login onLogin={manejarLogin} onIrRegistro={() => setVista('registro')} />;
  if (vista === 'registro') return <Registro onVolverLogin={() => setVista('login')} />;

  // Vista principal con navegación
  return (
    <>
      <Navbar onSalir={cerrarSesion} onNavegar={setVista} />
      <div className="container">
        <h1>RegCal 🍽️</h1>
        <CaloriasHoy usuarioId={usuario._id} />
        {vista === 'app' && <><ComidaForm onComidaRegistrada={() => {}} usuarioId={usuario._id} /><ListaComidas usuarioId={usuario._id} /></>}
        {vista === 'historial' && <Historial usuarioId={usuario._id} />}
      </div>
    </>
  );
}
export default App;
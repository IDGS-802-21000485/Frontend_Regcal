import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Registro from './Components/Registro';
import MainLayout from './Layouts/MainLayout';
import ComidaForm from './Components/ComidaForm';
import ListaComidas from './Components/ListaComida';
import CaloriasHoy from './Components/CaloriasHoy';
import Historial from './Components/Historial';
import PerfilUsuario from './Components/PerfilUsuario';
import './App.css';

function App() {
  const recargar = () => window.location.reload();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userGuardado = JSON.parse(localStorage.getItem('usuario'));
    if (userGuardado) {
      setUsuario(userGuardado);
    }
  }, []);

  const manejarLogin = (usuarioLogeado, token) => {
    localStorage.setItem('usuario', JSON.stringify(usuarioLogeado));
    localStorage.setItem('token', token);
    setUsuario(usuarioLogeado);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
  };

  const actualizarUsuario = (usuarioActualizado, token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
  };

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={
          usuario ? <Navigate to="/" /> : 
          <Login onLogin={manejarLogin} />
        } />
        
        <Route path="/registro" element={
          usuario ? <Navigate to="/" /> : 
          <Registro onRegistrado={() => window.location.href = '/login'} />
        } />
        
        {/* Ruta raíz protegida */}
        <Route path="/" element={
          usuario ? (
            <MainLayout usuario={usuario} onSalir={cerrarSesion}>
              <CaloriasHoy usuarioId={usuario._id} />
              <ComidaForm onComidaRegistrada={recargar} usuarioId={usuario._id} />
              <ListaComidas usuarioId={usuario._id} />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />
        
        {/* Ruta de historial protegida */}
        <Route path="/historial" element={
          usuario ? (
            <MainLayout usuario={usuario} onSalir={cerrarSesion}>
              <Historial usuarioId={usuario._id} />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        {/* Nueva ruta de perfil de usuario */}
        <Route path="/perfil" element={
          usuario ? (
            <MainLayout usuario={usuario} onSalir={cerrarSesion}>
              <PerfilUsuario 
                usuario={usuario} 
                onUsuarioActualizado={actualizarUsuario} 
              />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
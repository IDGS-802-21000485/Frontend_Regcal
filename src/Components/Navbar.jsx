import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ usuario, onSalir }) {
  return (
    <nav className="navbar-container">
      <div className="navbar-brand">
        <Link to="/">RegCal 🍽️</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/historial" className="nav-link">Historial</Link>
        {usuario && (
          <Link to="/perfil" className="nav-link">Mi Perfil</Link>
        )}
        <Link to="/recetas" className="nav-link">Recetas</Link>
        <Link to="/ingredientes" className="nav-link">Ingredientes</Link>
      </div>
      
      {usuario && (
        <div className="user-section">
          <div className="user-info">
            <span className="user-name">{usuario.nombre || usuario.email.split('@')[0]}</span>
            <span className="user-email">{usuario.email}</span>
          </div>
          <button onClick={onSalir} className="logout-button">
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}
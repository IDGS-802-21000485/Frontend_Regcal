// src/components/Navbar.jsx
import { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';


export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <nav className="navbar">
      <div className="logo">RegCal 🍽️</div>

      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`nav-links ${menuAbierto ? 'activo' : ''}`}>
        <li><Link to="/">Registrar</Link></li>
        <li><Link to="/comidas">Comidas</Link></li>
        <li><Link to="/calorias">Calorías</Link></li>
        <li><Link to="/historial">Historial</Link></li>
      </ul>
    </nav>
  );
}

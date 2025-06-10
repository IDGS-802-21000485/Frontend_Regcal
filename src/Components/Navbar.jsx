// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./Navbar.css";

// Navbar.jsx
export default function Navbar({ onSalir, onNavegar }) {
  return (
    <nav className="navbar">
      <div className="logo">🍽️ RegCal</div>
      <ul className="nav-links">
        <li><a href="#" onClick={() => onNavegar('app')}>Registro</a></li>
        <li><a href="#" onClick={() => onNavegar('historial')}>Historial</a></li>
        <li><a href="#" onClick={onSalir}>Salir</a></li>
      </ul>
    </nav>
  );
}

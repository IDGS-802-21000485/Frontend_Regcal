import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ usuario, onSalir }) {
  const [abierto, setAbierto] = useState(false);

  const cerrarMenu = () => setAbierto(false);

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <header className="topbar">
        <button className="hamburger" onClick={() => setAbierto(true)}>
          ☰
        </button>

        <Link to="/" className="brand">
          RegCal 🍽️
        </Link>
      </header>

      {/* Overlay móvil */}
      {abierto && <div className="overlay" onClick={cerrarMenu} />}

      {/* ================= SIDEBAR (MÓVIL) ================= */}
      <aside className={`sidebar ${abierto ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Menú</h3>
          <button className="close-btn" onClick={cerrarMenu}>✕</button>
        </div>

        <nav className="sidebar-links">
          <Link to="/" onClick={cerrarMenu}>🏠 Inicio</Link>
          <Link to="/historial" onClick={cerrarMenu}>📅 Historial</Link>
          <Link to="/recetas" onClick={cerrarMenu}>🍽️ Recetas</Link>
          <Link to="/ingredientes" onClick={cerrarMenu}>🥬 Ingredientes</Link>
          <Link to="/productos-procesados" onClick={cerrarMenu}>🏷️ Productos</Link>
          <Link to="/perfil" onClick={cerrarMenu}>👤 Mi Perfil</Link>
        </nav>

        {usuario && (
          <div className="sidebar-footer">
            <div className="user-info">
              <strong>{usuario.nombre || usuario.email.split("@")[0]}</strong>
              <small>{usuario.email}</small>
            </div>

            <button className="logout-btn" onClick={onSalir}>
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>

      {/* ================= DESKTOP NAVBAR ================= */}
      <nav className="navbar-desktop">
        <div className="navbar-left">
          <Link to="/" className="brand">RegCal 🍽️</Link>

          <Link to="/">Inicio</Link>
          <Link to="/historial">Historial</Link>
          <Link to="/recetas">Recetas</Link>
          <Link to="/ingredientes">Ingredientes</Link>
          <Link to="/productos-procesados">Productos</Link>
        </div>

        {usuario && (
          <div className="navbar-right">
            <Link to="/perfil" className="perfil-link">
              {usuario.nombre || usuario.email.split("@")[0]}
            </Link>
            <button className="logout-button" onClick={onSalir}>
              Cerrar sesión
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

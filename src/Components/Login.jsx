import { useState } from "react";
import axios from "axios";
import "./Auth.css";

export default function LoginForm({ onLogin, onIrRegistro }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post("https://backend-regcal.onrender.com/api/auth/login", {
        email,
        password,
      });
      onLogin(res.data.usuario);
    } catch (err) {
      setError("Credenciales incorrectas o error de conexión");
      console.error("Error al iniciar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Entrar"}
        </button>
         <p>¿No tienes cuenta? <a href="#" onClick={onIrRegistro}>Crear una</a></p>
      </form>
    </div>
  );
}

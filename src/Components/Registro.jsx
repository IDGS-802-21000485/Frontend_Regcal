import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./Auth.css";

export default function RegistroForm({ onRegistrado }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    fechaNacimiento: "",
    estatura: "",
    peso: "",
    actividad: "sedentario",
    objetivo: "ligero",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const actualizar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const volverALogin = () => {
    navigate('/login');
  };

  const enviar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://backend-regcal.onrender.com/api/auth/register", 
        {
          ...form,
          estatura: Number(form.estatura),
          peso: Number(form.peso)
        }
      );
      
      if (response.status >= 200 && response.status < 300) {
        alert("Cuenta creada con éxito");
        // Redirige al login después de 1.5 segundos
        setTimeout(() => {
          navigate('/login');
        }, 1500);
        
        // Llama a la función de callback si existe
        if (onRegistrado) {
          onRegistrado();
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         (err.response?.data?.errors ? 
                          Object.values(err.response.data.errors).join(", ") : 
                          "Error al registrar");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="auth-form">
          {/* Botón de volver */}
          <button 
            onClick={volverALogin}
            className="back-button"
            disabled={loading}
          >
            &larr; Volver al login
          </button>
          
          <h2>Crear cuenta</h2>
          <p className="form-subtitle">Completa tus datos para comenzar</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={enviar}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={actualizar}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={actualizar}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={actualizar}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
              <input
                id="fechaNacimiento"
                type="date"
                name="fechaNacimiento"
                value={form.fechaNacimiento}
                onChange={actualizar}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="estatura">Estatura (cm)</label>
              <input
                id="estatura"
                type="number"
                name="estatura"
                value={form.estatura}
                onChange={actualizar}
                required
                min="100"
                max="250"
              />
            </div>

            <div className="form-group">
              <label htmlFor="peso">Peso (kg)</label>
              <input
                id="peso"
                type="number"
                name="peso"
                value={form.peso}
                onChange={actualizar}
                required
                min="30"
                max="300"
              />
            </div>

            <div className="form-group">
              <label htmlFor="actividad">Actividad física</label>
              <select
                id="actividad"
                name="actividad"
                value={form.actividad}
                onChange={actualizar}
                required
              >
                <option value="sedentario">Sedentario</option>
                <option value="ligero">Ligero</option>
                <option value="moderado">Moderado</option>
                <option value="intenso">Intenso</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="objetivo">Objetivo</label>
              <select
                id="objetivo"
                name="objetivo"
                value={form.objetivo}
                onChange={actualizar}
                required
              >
                <option value="ligero">Déficit ligero (300 kcal)</option>
                <option value="pesado">Déficit fuerte (500 kcal)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>
                  <span className="spinner"></span> Registrando...
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

export default function RegistroForm({ onRegistrado }) {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    contrasenia: "",
    fechaNacimiento: "",
    estatura: "",
    peso: "",
    actividad: "sedentario",
    objetivo: "ligero",
  });

  const actualizar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enviar = async () => {
    try {
      await axios.post("https://backend-regcal.onrender.com/api/auth/registro", form);
      alert("Cuenta creada con éxito");
      onRegistrado();
    } catch (err) {
      alert("Error al registrar");
    }
  };

  return (
    <div className="auth-form">
      <h2>Crear cuenta</h2>
      <input type="text" placeholder="Nombre completo" name="nombre" onChange={actualizar} />
      <input type="email" placeholder="Correo electrónico" name="email" onChange={actualizar} />
      <input type="password" placeholder="Contraseña" name="contrasenia" onChange={actualizar} />
      <input type="date" name="fechaNacimiento" onChange={actualizar} />
      <input type="number" placeholder="Estatura (cm)" name="estatura" onChange={actualizar} />
      <input type="number" placeholder="Peso (kg)" name="peso" onChange={actualizar} />

      <label>Actividad física:</label>
      <select name="actividad" onChange={actualizar}>
        <option value="sedentario">Sedentario</option>
        <option value="ligero">Ligero</option>
        <option value="moderado">Moderado</option>
        <option value="intenso">Intenso</option>
      </select>

      <label>Objetivo:</label>
      <select name="objetivo" onChange={actualizar}>
        <option value="ligero">Déficit ligero (300 kcal)</option>
        <option value="pesado">Déficit fuerte (500 kcal)</option>
      </select>

      <button onClick={enviar}>Crear cuenta</button>
    </div>
  );
}

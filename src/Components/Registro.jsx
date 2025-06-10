import { useState } from 'react';
import axios from 'axios';

export default function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    estatura: '',
    peso: '',
    actividad: 'sedentario',
    objetivo: 'ligero',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enviar = async () => {
    try {
      await axios.post('https://backend-regcal.onrender.com/api/auth/register', form);
      alert('Cuenta creada exitosamente');
      setForm({ nombre: '', email: '', password: '', fechaNacimiento: '', estatura: '', peso: '', actividad: 'sedentario', objetivo: 'ligero' });
    } catch (err) {
      alert(err.response?.data?.mensaje || 'Error al registrar');
    }
  };

  return (
    <div className="formulario">
      <h2>Crear cuenta</h2>
      <input type="text" name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} />
      <input type="email" name="email" placeholder="Correo" value={form.email} onChange={handleChange} />
      <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
      <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
      <input type="number" name="estatura" placeholder="Estatura (cm)" value={form.estatura} onChange={handleChange} />
      <input type="number" name="peso" placeholder="Peso (kg)" value={form.peso} onChange={handleChange} />
      
      <label>Actividad:</label>
      <select name="actividad" value={form.actividad} onChange={handleChange}>
        <option value="sedentario">Sedentario</option>
        <option value="ligero">Ligero</option>
        <option value="moderado">Moderado</option>
        <option value="activo">Activo</option>
        <option value="muy_activo">Muy activo</option>
      </select>

      <label>Objetivo:</label>
      <select name="objetivo" value={form.objetivo} onChange={handleChange}>
        <option value="ligero">Déficit ligero (-300 kcal)</option>
        <option value="pesado">Déficit pesado (-500 kcal)</option>
      </select>

      <button onClick={enviar}>Registrarse</button>
    </div>
  );
}

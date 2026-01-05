import { useState } from "react";
import axios from "axios";

export default function AlimentoForm({ usuarioId, onGuardado }) {
  const [form, setForm] = useState({
    nombre: "",
    marca: "",
    porcion: "",
    peso: "",
    calories: "",
    proteins: "",
    fats: "",
    carbs: "",
    sugars: "",
    foto: null,
  });

  const actualizar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarFoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, foto: reader.result });
    reader.readAsDataURL(file);
  };

  const enviar = async (e) => {
    e.preventDefault();

    await axios.post(
      "https://backend-regcal.onrender.com/api/alimentos-procesados",
      {
        usuarioId,
        nombre: form.nombre,
        marca: form.marca,
        porcion: form.porcion,
        peso: Number(form.peso),
        foto: form.foto,
        nutricional: {
          calories: Number(form.calories),
          proteins: Number(form.proteins),
          fats: Number(form.fats),
          carbs: Number(form.carbs),
          sugars: Number(form.sugars),
        },
      }
    );

    onGuardado();
  };

  return (
    <form className="alimento-form" onSubmit={enviar}>
      <h3>Registrar alimento</h3>

      <input name="nombre" placeholder="Nombre" onChange={actualizar} required />
      <input name="marca" placeholder="Marca" onChange={actualizar} />
      <input name="porcion" placeholder="Porción (ej. 1 barrita)" onChange={actualizar} />
      <input name="peso" type="number" placeholder="Peso (g o ml)" onChange={actualizar} />

      <div className="nutri-grid">
        <input name="calories" type="number" placeholder="Calorías" onChange={actualizar} required />
        <input name="proteins" type="number" placeholder="Proteínas" onChange={actualizar} required />
        <input name="fats" type="number" placeholder="Grasas" onChange={actualizar} required />
        <input name="carbs" type="number" placeholder="Carbohidratos" onChange={actualizar} required />
        <input name="sugars" type="number" placeholder="Azúcares" onChange={actualizar} required />
      </div>

      <input type="file" accept="image/*" onChange={manejarFoto} />

      <button type="submit">Guardar alimento</button>
    </form>
  );
}

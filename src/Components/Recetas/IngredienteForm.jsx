import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Recetas.css";

export default function IngredienteForm({ usuarioId, onGuardado }) {
  const [form, setForm] = useState({
    nombre: "",
    unidadBase: "g",
    calories: "",
    proteins: "",
    fats: "",
    carbs: "",
    sugars: "",
    imagen: null,
  });

  const [loading, setLoading] = useState(false);

  const actualizar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imagen: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const enviar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        usuarioId,
        nombre: form.nombre,
        unidadBase: form.unidadBase,
        nutricional: {
          calories: Number(form.calories),
          proteins: Number(form.proteins),
          fats: Number(form.fats),
          carbs: Number(form.carbs),
          sugars: Number(form.sugars),
        },
        imagen: form.imagen || null,
      };

      await axios.post(
        "https://backend-regcal.onrender.com/api/ingredientes",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await Swal.fire({
        title: "Ingrediente guardado",
        text: "El ingrediente fue registrado correctamente (valores por 100g/ml)",
        icon: "success",
        confirmButtonColor: "#2c3e50"
      });

      setForm({
        nombre: "",
        unidadBase: "g",
        calories: "",
        proteins: "",
        fats: "",
        carbs: "",
        sugars: "",
        imagen: null,
      });

      if (onGuardado) onGuardado();
    } catch (err) {
      const mensaje =
        err.response?.data?.message ||
        "Error al registrar el ingrediente";

      Swal.fire({
        title: "Error",
        text: mensaje,
        icon: "error",
        confirmButtonColor: "#c0392b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h3>Registrar ingrediente (por 100g / 100ml)</h3>

      <form onSubmit={enviar}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del ingrediente"
          value={form.nombre}
          onChange={actualizar}
          required
        />

        <select
          name="unidadBase"
          value={form.unidadBase}
          onChange={actualizar}
        >
          <option value="g">Gramos (g)</option>
          <option value="ml">Mililitros (ml)</option>
        </select>

        <input
          type="number"
          name="calories"
          placeholder="Calorías"
          value={form.calories}
          onChange={actualizar}
          required
        />

        <input
          type="number"
          name="proteins"
          placeholder="Proteínas (g)"
          value={form.proteins}
          onChange={actualizar}
          required
        />

        <input
          type="number"
          name="fats"
          placeholder="Grasas (g)"
          value={form.fats}
          onChange={actualizar}
          required
        />

        <input
          type="number"
          name="carbs"
          placeholder="Carbohidratos (g)"
          value={form.carbs}
          onChange={actualizar}
          required
        />

        <input
          type="number"
          name="sugars"
          placeholder="Azúcares (g)"
          value={form.sugars}
          onChange={actualizar}
          required
        />

        <input type="file" accept="image/*" onChange={manejarImagen} />

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar ingrediente"}
        </button>
      </form>
    </div>
  );
}

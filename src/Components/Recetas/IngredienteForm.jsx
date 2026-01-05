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
        text: "Valores registrados por 100g / 100ml",
        icon: "success",
        confirmButtonColor: "#2c3e50",
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

      onGuardado?.();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.message ||
          "Error al registrar el ingrediente",
        icon: "error",
        confirmButtonColor: "#c0392b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h3>🥬 Nuevo ingrediente</h3>
      <p style={{ opacity: 0.7, marginBottom: 16 }}>
        Valores nutricionales por 100g / 100ml
      </p>

      <form onSubmit={enviar}>
        {/* Nombre */}
        <div className="form-group">
          <label>Nombre del ingrediente</label>
          <input
            type="text"
            name="nombre"
            placeholder="Ej. Pechuga de pollo"
            value={form.nombre}
            onChange={actualizar}
            required
          />
        </div>

        {/* Unidad */}
        <div className="form-group">
          <label>Unidad base</label>
          <select
            name="unidadBase"
            value={form.unidadBase}
            onChange={actualizar}
          >
            <option value="g">Gramos (g)</option>
            <option value="ml">Mililitros (ml)</option>
          </select>
        </div>

        <hr />

        {/* Nutrición */}
        <h4>Información nutricional</h4>

        <div className="form-group">
          <label>Calorías</label>
          <input
            type="number"
            name="calories"
            placeholder="kcal"
            value={form.calories}
            onChange={actualizar}
            required
          />
        </div>

        <div className="form-group">
          <label>Proteínas (g)</label>
          <input
            type="number"
            name="proteins"
            value={form.proteins}
            onChange={actualizar}
            required
          />
        </div>

        <div className="form-group">
          <label>Grasas (g)</label>
          <input
            type="number"
            name="fats"
            value={form.fats}
            onChange={actualizar}
            required
          />
        </div>

        <div className="form-group">
          <label>Carbohidratos (g)</label>
          <input
            type="number"
            name="carbs"
            value={form.carbs}
            onChange={actualizar}
            required
          />
        </div>

        <div className="form-group">
          <label>Azúcares (g)</label>
          <input
            type="number"
            name="sugars"
            value={form.sugars}
            onChange={actualizar}
            required
          />
        </div>

        {/* Imagen */}
        <div className="form-group">
          <label>Imagen (opcional)</label>
          <input type="file" accept="image/*" onChange={manejarImagen} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando..." : "Guardar ingrediente"}
        </button>
      </form>
    </div>
  );
}

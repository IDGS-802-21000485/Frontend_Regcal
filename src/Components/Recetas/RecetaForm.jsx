import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./Recetas.css";

export default function RecetaForm({ usuarioId, onRecetaGuardada }) {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState(null);
  const [ingredientesDB, setIngredientesDB] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     Cargar ingredientes
  ========================= */
  useEffect(() => {
    const cargarIngredientes = async () => {
      try {
        const res = await axios.get(
          `https://backend-regcal.onrender.com/api/ingredientes?usuarioId=${usuarioId}`
        );
        setIngredientesDB(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    cargarIngredientes();
  }, [usuarioId]);

  /* =========================
     Imagen
  ========================= */
  const manejarImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagen(reader.result);
    reader.readAsDataURL(file);
  };

  /* =========================
     Ingredientes receta
  ========================= */
  const agregarIngrediente = () => {
    setIngredientes([
      ...ingredientes,
      { ingredienteId: "", cantidad: "", unidad: "g" },
    ]);
  };

  const actualizarIngrediente = (index, campo, valor) => {
    const copia = [...ingredientes];
    copia[index][campo] = valor;
    setIngredientes(copia);
  };

  const eliminarIngrediente = (index) => {
    setIngredientes(ingredientes.filter((_, i) => i !== index));
  };

  /* =========================
     Enviar receta
  ========================= */
  const enviar = async (e) => {
    e.preventDefault();

    if (!nombre || ingredientes.length === 0) {
      return Swal.fire("Error", "Completa la receta", "error");
    }

    setLoading(true);

    try {
      await axios.post(
        "https://backend-regcal.onrender.com/api/recetas",
        {
          usuarioId,
          nombre: nombre,
          imagen,
          ingredientes,
        }
      );

      Swal.fire("¡Listo!", "Receta guardada", "success");
      setNombre("");
      setImagen(null);
      setIngredientes([]);

      if (onRecetaGuardada) onRecetaGuardada();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.mensaje || "No se pudo guardar",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-form">
      <h3>Nueva receta</h3>

      <form onSubmit={enviar}>
        <div className="form-group">
          <label>Nombre de la receta</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Imagen (opcional)</label>
          <input type="file" accept="image/*" onChange={manejarImagen} />
        </div>

        <hr />

        <h4>Ingredientes</h4>

        {ingredientes.map((item, index) => (
          <div className="ingrediente-row" key={index}>
            <select
              value={item.ingredienteId}
              onChange={(e) =>
                actualizarIngrediente(index, "ingredienteId", e.target.value)
              }
              required
            >
              <option value="">Selecciona ingrediente</option>
              {ingredientesDB.map((ing) => (
                <option key={ing._id} value={ing._id}>
                  {ing.nombre}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Cantidad"
              value={item.cantidad}
              onChange={(e) =>
                actualizarIngrediente(index, "cantidad", e.target.value)
              }
              required
            />

            <select
              value={item.unidad}
              onChange={(e) =>
                actualizarIngrediente(index, "unidad", e.target.value)
              }
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
            </select>

            <button
              type="button"
              className="btn-danger"
              onClick={() => eliminarIngrediente(index)}
            >
              ✕
            </button>
          </div>
        ))}

        <button type="button" className="btn-secondary" onClick={agregarIngrediente}>
          + Agregar ingrediente
        </button>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Guardando..." : "Guardar receta"}
        </button>
      </form>
    </div>
  );
}

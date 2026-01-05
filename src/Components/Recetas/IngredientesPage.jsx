import { useEffect, useState } from "react";
import axios from "axios";
import IngredienteCard from "./IngredienteCard";
import IngredienteForm from "./IngredienteForm";
import "./Recetas.css";

export default function IngredientesPage({ usuarioId }) {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarIngredientes = async () => {
    if (!usuarioId) return;

    try {
      setLoading(true);
      const res = await axios.get(
        "https://backend-regcal.onrender.com/api/ingredientes",
        {
          params: { usuarioId },
        }
      );
      setIngredientes(res.data);
    } catch (error) {
      console.error("Error al cargar ingredientes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarIngredientes();
  }, [usuarioId]);

  return (
    <div className="page-container">
      <h2>🥬 Ingredientes (valores por 100g / 100ml)</h2>

      {/* Formulario */}
      <IngredienteForm
        usuarioId={usuarioId}
        onGuardado={cargarIngredientes} // 🔥 recarga al guardar
      />

      {/* Lista */}
      {loading ? (
        <p>Cargando ingredientes...</p>
      ) : (
        <div className="grid">
          {ingredientes.length === 0 ? (
            <p>No hay ingredientes registrados</p>
          ) : (
            ingredientes.map((ing) => (
              <IngredienteCard
                key={ing._id}
                ingrediente={ing}
                onEliminado={cargarIngredientes} // 🔥 recarga al eliminar
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

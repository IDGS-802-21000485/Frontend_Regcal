import { useEffect, useState } from "react";
import axios from "axios";
import RecetaCard from "./RecetaCard";
import RecetaForm from "./RecetaForm";
import "./Recetas.css";

export default function RecetasPage({ usuarioId }) {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarRecetas = async () => {
    if (!usuarioId) return;

    try {
      setLoading(true);
      const res = await axios.get(
        "https://backend-regcal.onrender.com/api/recetas",
        {
          params: { usuarioId },
        }
      );
      setRecetas(res.data);
    } catch (error) {
      console.error("Error al cargar recetas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarRecetas();
  }, [usuarioId]);

  return (
    <div className="page-container">
      <h2>🍽️ Recetas</h2>

      {/* Formulario */}
      <RecetaForm
        usuarioId={usuarioId}
                onRecetaGuardada={cargarRecetas} // 🔥 refresca al guardar
      />

      {/* Lista */}
      {loading ? (
        <p>Cargando recetas...</p>
      ) : (
        <div className="grid">
          {recetas.length === 0 ? (
            <p>No hay recetas registradas</p>
          ) : (
            recetas.map((receta) => (
              <RecetaCard
                key={receta._id}
                receta={receta}
                onEliminada={cargarRecetas} // 🔥 refresca al eliminar
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

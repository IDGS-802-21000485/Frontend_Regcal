import { useEffect, useState } from "react";
import axios from "axios";
import RecetaCard from "./RecetaCard";
import RecetaForm from "./RecetaForm";
import "./Recetas.css";

export default function RecetasPage({ usuarioId }) {
  const [recetas, setRecetas] = useState([]);

  const cargar = async () => {
    const res = await axios.get(
      `https://backend-regcal.onrender.com/api/recetas?usuarioId=${usuarioId}`
    );
    setRecetas(res.data);
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="page-container">
      <h2>🍽️ Recetas</h2>

      <RecetaForm usuarioId={usuarioId} onGuardado={cargar} />

      <div className="grid">
        {recetas.map((r) => (
          <RecetaCard key={r._id} receta={r} />
        ))}
      </div>
    </div>
  );
}

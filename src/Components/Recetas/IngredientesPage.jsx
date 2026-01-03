import { useEffect, useState } from "react";
import axios from "axios";
import IngredienteCard from "./IngredienteCard";
import IngredienteForm from "./IngredienteForm";
import "./Recetas.css";

export default function IngredientesPage({ usuarioId }) {
  const [ingredientes, setIngredientes] = useState([]);

  const cargarIngredientes = async () => {
    const res = await axios.get(
      `https://backend-regcal.onrender.com/api/ingredientes?usuarioId=${usuarioId}`
    );
    setIngredientes(res.data);
  };

  useEffect(() => {
    cargarIngredientes();
  }, []);

  return (
    <div className="page-container">
      <h2>🥬 Ingredientes (valores por 100g / 100ml)</h2>

      <IngredienteForm usuarioId={usuarioId} onGuardado={cargarIngredientes} />

      <div className="grid">
        {ingredientes.map((ing) => (
          <IngredienteCard key={ing._id} ingrediente={ing} />
        ))}
      </div>
    </div>
  );
}

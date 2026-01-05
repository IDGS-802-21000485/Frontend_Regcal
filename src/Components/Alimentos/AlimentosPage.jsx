import { useEffect, useState } from "react";
import axios from "axios";
import AlimentoForm from "./AlimentoForm";
import AlimentoCard from "./AlimentoCard";
import "./Alimentos.css";

export default function AlimentosPage({ usuarioId }) {
  const [alimentos, setAlimentos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargarAlimentos = async () => {
    const res = await axios.get(
      `https://backend-regcal.onrender.com/api/alimentos-procesados?usuarioId=${usuarioId}`
    );
    setAlimentos(res.data);
  };

  useEffect(() => {
    cargarAlimentos();
  }, []);

  return (
    <div className="alimentos-container">
      <div className="alimentos-header">
        <h2>🧃 Alimentos procesados</h2>
        <button onClick={() => setMostrarForm(!mostrarForm)}>
          ➕ Nuevo alimento
        </button>
      </div>

      {mostrarForm && (
        <AlimentoForm
          usuarioId={usuarioId}
          onGuardado={() => {
            setMostrarForm(false);
            cargarAlimentos();
          }}
        />
      )}

      <div className="alimentos-grid">
        {alimentos.map((a) => (
          <AlimentoCard
            key={a._id}
            alimento={a}
            onEliminado={cargarAlimentos}
            usuarioId={usuarioId}
          />
        ))}
      </div>
    </div>
  );
}

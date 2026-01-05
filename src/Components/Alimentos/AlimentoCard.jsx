import axios from "axios";

export default function AlimentoCard({ alimento, onEliminado, usuarioId }) {
  const eliminar = async () => {
    await axios.delete(
      `https://backend-regcal.onrender.com/api/alimentos-procesados/${alimento._id}`
    );
    onEliminado();
  };

  const consumir = async () => {
    const fecha = new Date().toISOString().slice(0, 10);

    await axios.post("https://backend-regcal.onrender.com/api/comidas/manual", {
      usuarioId,
      fecha,
      title: alimento.nombre,
      foto: alimento.foto,
      calorias: alimento.nutricional.calories,
      nutricional: alimento.nutricional,
    });

    alert("Alimento registrado hoy 🍽️");
  };

  return (
    <div className="alimento-card">
      {alimento.foto && <img src={alimento.foto} />}
      <h4>{alimento.nombre}</h4>
      <p>{alimento.marca}</p>
      <strong>{alimento.nutricional.calories} kcal</strong>

      <div className="card-actions">
        <button onClick={consumir}>➕ Consumir</button>
        <button onClick={eliminar} className="danger">🗑</button>
      </div>
    </div>
  );
}

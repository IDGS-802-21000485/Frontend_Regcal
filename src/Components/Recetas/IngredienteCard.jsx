import Swal from "sweetalert2";
import axios from "axios";


export default function IngredienteCard({ ingrediente, onEliminado }) {
  const eliminar = async () => {
    const confirm = await Swal.fire({
      title: "¿Eliminar ingrediente?",
      text: ingrediente.nombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c0392b",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Sí, eliminar",
    });

    if (!confirm.isConfirmed) return;

      await axios.delete(
        `https://backend-regcal.onrender.com/api/ingredientes/${ingrediente._id}`
      );

      Swal.fire("Eliminado", "Ingrediente eliminado", "success");
      onEliminado();
  };

  return (
    <div className="card">
      <button className="delete-btn" onClick={eliminar}>🗑️</button>

      {ingrediente.imagen && (
        <img src={ingrediente.imagen} alt={ingrediente.nombre} />
      )}

      <h4>{ingrediente.nombre}</h4>
      <p>{ingrediente.nutricional.calories} kcal / 100g</p>
    </div>
  );
}

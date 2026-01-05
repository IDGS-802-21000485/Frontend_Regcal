import Swal from "sweetalert2";
import axios from "axios";

export default function RecetaCard({ receta, onEliminada }) {
  const eliminar = async () => {
    const confirm = await Swal.fire({
      title: "¿Eliminar receta?",
      text: receta.nombre,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c0392b",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Sí, eliminar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `https://backend-regcal.onrender.com/api/recetas/${receta._id}`
      );

      Swal.fire("Eliminada", "Receta eliminada correctamente", "success");

      if (onEliminada) onEliminada(); // 🔥 refresca la lista
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar la receta", "error");
    }
  };

  return (
    <div className="card">
      <button className="delete-btn" onClick={eliminar}>🗑️</button>

      {receta.imagen && (
        <img src={receta.imagen} alt={receta.nombre} />
      )}

      <h4>{receta.nombre}</h4>

      <p>
        🔥 {receta.nutricional.calories} kcal <br />
        🥩 {receta.nutricional.proteins} g proteína
      </p>
    </div>
  );
}

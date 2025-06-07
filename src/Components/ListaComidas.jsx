import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ListaComidas() {
  const [comidas, setComidas] = useState([]);
  const [comidaSeleccionada, setComidaSeleccionada] = useState(null);

  const cargarComidas = async () => {
    try {
      const fecha = new Date().toISOString().slice(0, 10);
      const res = await axios.get(`http://localhost:5000/api/comidas/dia?usuarioId=usuario123&fecha=${fecha}`);
      setComidas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarComidas();
  }, []);

  return (
    <div>
      <h2>Comidas registradas hoy</h2>
      <div className="grid">
        {comidas.map((c) => (
          <div key={c._id} className="card" onClick={() => setComidaSeleccionada(c)}>
            <img src={c.foto} alt={c.title} width="150" height="150" />
            <p><strong>{c.title}</strong></p>
          </div>
        ))}
      </div>

      {comidaSeleccionada && (
        <div className="detalle">
          <h3>{comidaSeleccionada.title}</h3>
          <img src={comidaSeleccionada.foto} alt="Detalle" width="200" />
          <p><strong>Calorías:</strong> {comidaSeleccionada.nutricional.calories} kcal</p>
          <p><strong>Proteínas:</strong> {comidaSeleccionada.nutricional.proteins} g</p>
          <p><strong>Grasas:</strong> {comidaSeleccionada.nutricional.fats} g</p>
          <p><strong>Carbohidratos:</strong> {comidaSeleccionada.nutricional.carbs} g</p>
          <p><strong>Azúcares:</strong> {comidaSeleccionada.nutricional.sugars} g</p>
          <p><strong>Ingredientes:</strong></p>
          <ul>
            {comidaSeleccionada.ingredientes.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
          <button onClick={() => setComidaSeleccionada(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

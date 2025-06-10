import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ListaComidas({usuarioId}) {
  const [comidas, setComidas] = useState([]);
  const [comidaSeleccionada, setComidaSeleccionada] = useState(null);
  function obtenerFechaLocal() {
  const fecha = new Date();
  const offset = fecha.getTimezoneOffset(); // minutos entre UTC y tu zona
  const local = new Date(fecha.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10); // ya en hora local
}

  const cargarComidas = async () => {
    try {
      const fecha = obtenerFechaLocal();
      const res = await axios.get(`https://backend-regcal.onrender.com/api/comidas/dia?usuarioId=${usuarioId}&fecha=${fecha}`);
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

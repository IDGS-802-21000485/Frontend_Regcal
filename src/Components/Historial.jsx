// src/components/Historial.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Historial.css';

export default function Historial() {
  const [dias, setDias] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [comidas, setComidas] = useState([]);

  
  useEffect(() => {
    const hoy = new Date();
    const ultimos7Dias = [...Array(7)].map((_, i) => {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i);
      return fecha.toISOString().slice(0, 10);
    }).reverse();
    setDias(ultimos7Dias);
  }, []);

  const cargarComidas = async (fecha) => {
    setSeleccionado(fecha);
    try {
      const res = await axios.get(
        `https://backend-regcal.onrender.com/api/comidas/dia?usuarioId=usuario123&fecha=${fecha}`
      );
      setComidas(res.data);
    } catch (err) {
      console.error('Error al cargar historial:', err);
    }
  };

  const totalCalorias = comidas.reduce((sum, c) => sum + (c.calorias || 0), 0);

  return (
    <div className="historial">
      <h2 id="historial">📅 Historial Semanal</h2>
      <div className="dias">
        {dias.map((dia) => (
          <button
            key={dia}
            onClick={() => cargarComidas(dia)}
            className={seleccionado === dia ? 'activo' : ''}
          >
            {dia}
          </button>
        ))}
      </div>

      {seleccionado && (
        <div className="detalle-dia">
          <h3>{seleccionado}</h3>
          <p><strong>Total:</strong> {totalCalorias.toFixed(2)} kcal</p>
          <div className="lista-comidas">
            {comidas.map((c) => (
              <div key={c._id} className="comida-item">
                <img src={c.foto} alt={c.title} />
                <div>
                  <strong>{c.title}</strong><br />
                  {c.calorias.toFixed(2)} kcal
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

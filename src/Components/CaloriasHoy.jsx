import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CaloriasHoy({ usuarioId }) {
  const [total, setTotal] = useState(0);

  function obtenerFechaLocal() {
  const fecha = new Date();
  const offset = fecha.getTimezoneOffset(); // minutos entre UTC y tu zona
  const local = new Date(fecha.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10); // ya en hora local
}


  const obtenerCalorias = async () => {
    const fecha = obtenerFechaLocal();
    try {
      const res = await axios.get(
        `https://backend-regcal.onrender.com/api/comidas/dia?usuarioId=${usuarioId}&fecha=${fecha}`
      );
      const comidas = res.data;
      const totalCalorias = comidas.reduce((sum, c) => sum + (c.calorias || 0), 0);
      setTotal(totalCalorias);
    } catch (err) {
      console.error('❌ Error al obtener calorías totales del día:', err.message);
    }
  };

  useEffect(() => {
    obtenerCalorias();
  }, []);

  return (
    <div className="marcador-calorias">
      <h3>🔥 Calorías consumidas hoy</h3>
      <p className="kcal">{total.toFixed(2)} kcal</p>
    </div>
  );
}

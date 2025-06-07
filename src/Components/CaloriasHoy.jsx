import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CaloriasHoy() {
  const [total, setTotal] = useState(0);

  const obtenerCalorias = async () => {
    const fecha = new Date().toISOString().slice(0, 10);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/comidas/dia?usuarioId=usuario123&fecha=${fecha}`
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

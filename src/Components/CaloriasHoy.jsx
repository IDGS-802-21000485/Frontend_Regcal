import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CaloriasHoy({ usuarioId }) {
  const [total, setTotal] = useState(0);
  const [metaCalorias, setMetaCalorias] = useState(0);
  const [nivelConsumo, setNivelConsumo] = useState(''); // 'bajo', 'adecuado', 'excedido'

  function obtenerFechaLocal() {
    const fecha = new Date();
    const offset = fecha.getTimezoneOffset();
    const local = new Date(fecha.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 10);
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
      evaluarConsumo(totalCalorias);
    } catch (err) {
      console.error('❌ Error al obtener calorías totales del día:', err.message);
    }
  };

  const obtenerMetaCalorias = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.caloriasObjetivo) {
      setMetaCalorias(usuario.caloriasObjetivo);
      return usuario.caloriasObjetivo;
    }
    return 2000; // Valor por defecto si no hay datos
  };

  const evaluarConsumo = (caloriasConsumidas) => {
    const meta = metaCalorias || obtenerMetaCalorias();
    const porcentaje = (caloriasConsumidas / meta) * 100;

    if (porcentaje < 70) {
      setNivelConsumo('bajo');
    } else if (porcentaje >= 70 && porcentaje <= 100) {
      setNivelConsumo('adecuado');
    } else {
      setNivelConsumo('excedido');
    }
  };

  useEffect(() => {
    obtenerMetaCalorias();
    obtenerCalorias();
  }, []);

  const getAlertClass = () => {
    switch(nivelConsumo) {
      case 'bajo':
        return 'alert-info';
      case 'adecuado':
        return 'alert-success';
      case 'excedido':
        return 'alert-danger';
      default:
        return '';
    }
  };

  const getAlertMessage = () => {
    const meta = metaCalorias || obtenerMetaCalorias();
    const restante = meta - total;
    
    switch(nivelConsumo) {
      case 'bajo':
        return `Todavía puedes consumir ${restante.toFixed(0)} kcal hoy. ¡Sigue así!`;
      case 'adecuado':
        return `Has alcanzado un buen balance. ${total < meta ? `Te faltan ${restante.toFixed(0)} kcal` : 'Estás en tu meta'}`;
      case 'excedido':
        return `Has excedido tu meta por ${Math.abs(restante).toFixed(0)} kcal. Considera ajustar tu consumo.`;
      default:
        return '';
    }
  };

  return (
    <div className="calorias-container">
      <div className="calorias-card">
        <h3>🔥 Calorías consumidas hoy</h3>
        <p className="calorias-total">{total.toFixed(0)} kcal</p>
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{
              width: `${Math.min(100, (total / metaCalorias) * 100)}%`,
              backgroundColor: 
                nivelConsumo === 'bajo' ? '#4CAF50' :
                nivelConsumo === 'adecuado' ? '#FFC107' :
                '#F44336'
            }}
          ></div>
          <span className="progress-meta">{metaCalorias.toFixed(0)} kcal (meta)</span>
        </div>
        
        {nivelConsumo && (
          <div className={`alert ${getAlertClass()}`}>
            {getAlertMessage()}
          </div>
        )}
      </div>
    </div>
  );
}
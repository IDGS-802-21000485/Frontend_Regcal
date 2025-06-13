import { useEffect, useState } from "react";
import axios from "axios";
import "./Historial.css";
import Swal from 'sweetalert2';

export default function Historial({ usuarioId }) {
  const [dias, setDias] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [comidas, setComidas] = useState([]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [numeroSemana, setNumeroSemana] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generarSemana(0);
  }, []);

  const obtenerNumeroSemana = (fecha) => {
    const primeraFecha = new Date(fecha.getFullYear(), 0, 1);
    const dias = Math.floor((fecha - primeraFecha) / (24 * 60 * 60 * 1000));
    return Math.ceil((dias + primeraFecha.getDay() + 1) / 7);
  };

  const mostrarError = (mensaje) => {
    Swal.fire({
      title: 'Error',
      text: mensaje,
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#2c3e50',
    });
  };

  const generarSemana = (offsetSemanas) => {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset();
    const local = new Date(hoy.getTime() - offset * 60 * 1000);

    const inicioSemana = new Date(local);
    inicioSemana.setDate(local.getDate() - local.getDay() + (offsetSemanas * 7));

    const nuevaSemana = obtenerNumeroSemana(inicioSemana);
    if (nuevaSemana < 1 || nuevaSemana > 53 || inicioSemana.getFullYear() < local.getFullYear()) {
      mostrarError('No hay más semanas disponibles');
      return;
    }

    const diasSemana = [...Array(7)].map((_, i) => {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      return {
        fechaISO: fecha.toISOString().slice(0, 10),
        diaNombre: fecha.toLocaleDateString("es-MX", { weekday: "long" }),
        fechaFormateada: fecha.toLocaleDateString("es-MX", { day: 'numeric', month: 'short' })
      };
    });

    setDias(diasSemana);
    setNumeroSemana(nuevaSemana);
    setSeleccionado(diasSemana[new Date().getDay()]?.fechaISO || diasSemana[0].fechaISO);
    cargarComidas(diasSemana[new Date().getDay()]?.fechaISO || diasSemana[0].fechaISO);
  };

  const cargarComidas = async (fecha) => {
    setLoading(true);
    setSeleccionado(fecha);
    try {
      const res = await axios.get(
        `https://backend-regcal.onrender.com/api/comidas/dia?usuarioId=${usuarioId}&fecha=${fecha}`
      );
      setComidas(res.data);
    } catch (err) {
      console.error("Error al cargar historial:", err);
      mostrarError('Error al cargar el historial de comidas');
    } finally {
      setLoading(false);
    }
  };

  const totalCalorias = comidas.reduce((sum, c) => sum + (c.calorias || 0), 0);

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h2>📅 Historial de Consumo</h2>
      </div>

      <div className="navegacion-semanal">
        <button 
          onClick={() => { setSemanaOffset(semanaOffset - 1); generarSemana(semanaOffset - 1); }}
          className="nav-button"
        >
          ⬅ Anterior
        </button>
        <span className="semana-indicador"><strong>Semana {numeroSemana}</strong></span>
        <button 
          onClick={() => { setSemanaOffset(semanaOffset + 1); generarSemana(semanaOffset + 1); }}
          className="nav-button"
        >
          Siguiente ➡
        </button>
      </div>

      <div className="dias-semana">
        {dias.map(({ fechaISO, diaNombre, fechaFormateada }) => (
          <button
            key={fechaISO}
            onClick={() => cargarComidas(fechaISO)}
            className={`dia-button ${seleccionado === fechaISO ? "activo" : ""}`}
          >
            <span className="dia-nombre">{diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1, 3)}</span>
            <span className="dia-fecha">{fechaFormateada}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="cargando">
          <div className="spinner"></div>
          <p>Cargando comidas...</p>
        </div>
      ) : (
        <div className="detalle-dia">
          <div className="resumen-dia">
            <h3>
              {dias.find((d) => d.fechaISO === seleccionado)?.diaNombre || "Día"}
              <span className="fecha-seleccionada"> ({seleccionado})</span>
            </h3>
            <div className="total-calorias">
              <span>Total consumido:</span>
              <strong>{totalCalorias.toFixed(0)} kcal</strong>
            </div>
          </div>

          <div className="lista-comidas">
            {comidas.length === 0 ? (
              <div className="sin-comidas">
                <p>No hay comidas registradas este día</p>
              </div>
            ) : (
              comidas.map((c) => (
                <div key={c._id} className="comida-card">
                  {c.foto && (
                    <div className="comida-imagen">
                      <img src={c.foto} alt={c.title} />
                    </div>
                  )}
                  <div className="comida-info">
                    <h4>{c.title}</h4>
                    <div className="comida-detalle">
                      <span className="calorias">{c.calorias.toFixed(0)} kcal</span>
                      {c.nutricional && (
                        <div className="nutrientes">
                          <span>P: {c.nutricional.proteins?.toFixed(1) || 0}g</span>
                          <span>C: {c.nutricional.carbs?.toFixed(1) || 0}g</span>
                          <span>G: {c.nutricional.fats?.toFixed(1) || 0}g</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
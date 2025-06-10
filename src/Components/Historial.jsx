// src/components/Historial.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./Historial.css";

export default function Historial({ usuarioId }) {
  const [dias, setDias] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [comidas, setComidas] = useState([]);
  const [semanaOffset, setSemanaOffset] = useState(0);
  const [numeroSemana, setNumeroSemana] = useState(1);
console.log("Usuario:", usuarioId);
  useEffect(() => {
    generarSemana(0);
  }, []);

  const obtenerNumeroSemana = (fecha) => {
    const primeraFecha = new Date(fecha.getFullYear(), 0, 1);
    const dias = Math.floor((fecha - primeraFecha) / (24 * 60 * 60 * 1000));
    return Math.ceil((dias + primeraFecha.getDay() + 1) / 7);
  };

  const generarSemana = (offsetSemanas) => {
    const hoy = new Date();
    const offset = hoy.getTimezoneOffset();
    const local = new Date(hoy.getTime() - offset * 60 * 1000);

    const inicioSemana = new Date(local);
    inicioSemana.setDate(local.getDate() - local.getDay() + (offsetSemanas * 7));

    // evita ir atrás de la semana 1
    const nuevaSemana = obtenerNumeroSemana(inicioSemana);
    if (nuevaSemana < 1 || nuevaSemana > 53 || inicioSemana.getFullYear() < local.getFullYear()) {
      return;
    }

    const diasSemana = [...Array(7)].map((_, i) => {
      const fecha = new Date(inicioSemana);
      fecha.setDate(inicioSemana.getDate() + i);
      return {
        fechaISO: fecha.toISOString().slice(0, 10),
        diaNombre: fecha.toLocaleDateString("es-MX", { weekday: "long" })
      };
    });

    setDias(diasSemana);
    setNumeroSemana(nuevaSemana);
    setSeleccionado(diasSemana[new Date().getDay()]?.fechaISO || diasSemana[0].fechaISO);
    cargarComidas(diasSemana[new Date().getDay()]?.fechaISO || diasSemana[0].fechaISO);
  };

  const cargarComidas = async (fecha) => {
    setSeleccionado(fecha);
    try {
      const res = await axios.get(
        `https://backend-regcal.onrender.com/api/comidas/dia?usuarioId=${usuarioId}&fecha=${fecha}`
      );
      setComidas(res.data);
    } catch (err) {
      console.error("Error al cargar historial:", err);
    }
  };

  const totalCalorias = comidas.reduce((sum, c) => sum + (c.calorias || 0), 0);

  return (
    <div className="historial">

      <div className="navegacion-semanal">
        <button onClick={() => { setSemanaOffset(semanaOffset - 1); generarSemana(semanaOffset - 1); }}>⬅ Anterior</button>
        <span><strong>Semana {numeroSemana}</strong></span>
        <button onClick={() => { setSemanaOffset(semanaOffset + 1); generarSemana(semanaOffset + 1); }}>Siguiente ➡</button>
      </div>

      <div className="dias">
        {dias.map(({ fechaISO, diaNombre }) => (
          <button
            key={fechaISO}
            onClick={() => cargarComidas(fechaISO)}
            className={seleccionado === fechaISO ? "activo" : ""}
          >
            {diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1)}
          </button>
        ))}
      </div>

      {seleccionado && (
        <div className="detalle-dia">
          <h3>
            {dias.find((d) => d.fechaISO === seleccionado)?.diaNombre || "Día"}
            {' '}({seleccionado})
          </h3>
          <p>
            <strong>Total:</strong> {totalCalorias.toFixed(2)} kcal
          </p>
          <div className="lista-comidas">
            {comidas.map((c) => (
              <div key={c._id} className="comida-item">
                <img src={c.foto} alt={c.title} />
                <div>
                  <strong>{c.title}</strong>
                  <br />
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

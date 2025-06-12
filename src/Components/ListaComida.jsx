import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ListaComidas({usuarioId}) {
  const [comidas, setComidas] = useState([]);
  const [comidaSeleccionada, setComidaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  function obtenerFechaLocal() {
    const fecha = new Date();
    const offset = fecha.getTimezoneOffset();
    const local = new Date(fecha.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 10);
  }

  const cargarComidas = async () => {
    setLoading(true);
    try {
      const fecha = obtenerFechaLocal();
      const res = await axios.get(`https://backend-regcal.onrender.com/api/comidas/dia?usuarioId=${usuarioId}&fecha=${fecha}`);
      setComidas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarComidas();
  }, []);

  return (
    <div className="comidas-container">
      <h2>🍽️ Comidas registradas hoy</h2>
      
      {loading ? (
        <div className="loading">Cargando comidas...</div>
      ) : comidas.length === 0 ? (
        <div className="empty-state">No hay comidas registradas hoy</div>
      ) : (
        <>
          <div className="comidas-grid">
            {comidas.map((c) => (
              <div 
                key={c._id} 
                className="comida-card"
                onClick={() => setComidaSeleccionada(c)}
              >
                {c.foto && (
                  <div className="comida-image">
                    <img src={c.foto} alt={c.title} />
                  </div>
                )}
                <div className="comida-info">
                  <h3>{c.title}</h3>
                  <p>{c.nutricional?.calories || 0} kcal</p>
                </div>
              </div>
            ))}
          </div>

          {comidaSeleccionada && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button 
                  className="close-button"
                  onClick={() => setComidaSeleccionada(null)}
                >
                  &times;
                </button>
                
                <h3>{comidaSeleccionada.title}</h3>
                
                {comidaSeleccionada.foto && (
                  <img 
                    src={comidaSeleccionada.foto} 
                    alt="Detalle" 
                    className="modal-image"
                  />
                )}
                
                <div className="nutricion-info">
                  <h4>Información Nutricional</h4>
                  <div className="nutricion-grid">
                    <div className="nutricion-item">
                      <span>Calorías</span>
                      <strong>{comidaSeleccionada.nutricional?.calories || 0} kcal</strong>
                    </div>
                    <div className="nutricion-item">
                      <span>Proteínas</span>
                      <strong>{comidaSeleccionada.nutricional?.proteins || 0} g</strong>
                    </div>
                    <div className="nutricion-item">
                      <span>Grasas</span>
                      <strong>{comidaSeleccionada.nutricional?.fats || 0} g</strong>
                    </div>
                    <div className="nutricion-item">
                      <span>Carbohidratos</span>
                      <strong>{comidaSeleccionada.nutricional?.carbs || 0} g</strong>
                    </div>
                  </div>
                </div>
                
                <div className="ingredientes-section">
                  <h4>Ingredientes</h4>
                  <ul>
                    {comidaSeleccionada.ingredientes.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
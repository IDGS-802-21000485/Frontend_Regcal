import { useState } from 'react';
import axios from 'axios';

export default function ComidaForm({ onComidaRegistrada, usuarioId }) {
  const [modoIngreso, setModoIngreso] = useState('automatico');
  const [title, setTitle] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [fotoBase64, setFotoBase64] = useState(null);
  const [calorias, setCalorias] = useState('');
  const [loading, setLoading] = useState(false);

  const convertirBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const manejarArchivo = async (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const base64 = await convertirBase64(archivo);
      setFotoBase64(base64);
    }
  };

  function obtenerFechaLocal() {
    const fecha = new Date();
    const offset = fecha.getTimezoneOffset();
    const local = new Date(fecha.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 10);
  }

  const enviar = async () => {
    setLoading(true);
    const fecha = obtenerFechaLocal();
    const body = {
      usuarioId,
      fecha,
      title,
      foto: fotoBase64,
    };

    let url = 'https://backend-regcal.onrender.com/api/comidas';

    if (modoIngreso === 'automatico') {
      const listaIngredientes = ingredientes
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);
      body.ingredientes = listaIngredientes;
    } else {
      url += '/manual';
      body.calorias = parseFloat(calorias);
    }

    try {
      await axios.post(url, body);
      alert('Comida registrada correctamente');
      onComidaRegistrada();
      setTitle('');
      setIngredientes('');
      setFotoBase64(null);
      setCalorias('');
    } catch (error) {
      console.error(error);
      alert('Error al registrar comida');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>🥗 Registrar nueva comida</h2>

        <div className="form-group">
          <label>Modo de ingreso:</label>
          <select
            value={modoIngreso}
            onChange={(e) => setModoIngreso(e.target.value)}
          >
            <option value="automatico">Usar inteligencia artificial</option>
            <option value="manual">Ingreso manual</option>
          </select>
        </div>

        <div className="form-group">
          <label>Título de la comida:</label>
          <input
            type="text"
            placeholder="Ej. Sándwich de pollo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {modoIngreso === 'automatico' ? (
          <div className="form-group">
            <label>Ingredientes (uno por línea):</label>
            <textarea
              rows={5}
              placeholder="Ej: 2 rebanadas de pan\n90g de pollo\n15g de lechuga"
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Calorías (kcal):</label>
            <input
              type="number"
              placeholder="Ej. 230"
              value={calorias}
              onChange={(e) => setCalorias(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label>Foto (opcional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={manejarArchivo}
          />
        </div>

        {fotoBase64 && (
          <div className="image-preview">
            <img
              src={fotoBase64}
              alt="Vista previa"
            />
          </div>
        )}

        <button 
          onClick={enviar} 
          disabled={loading}
          className="submit-button"
        >
          {loading ? 'Registrando...' : 'Registrar comida'}
        </button>
      </div>
    </div>
  );
}
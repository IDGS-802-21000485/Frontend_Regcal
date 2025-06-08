import { useState } from 'react';
import axios from 'axios';

export default function ComidaForm({ onComidaRegistrada }) {
  const [modoIngreso, setModoIngreso] = useState('automatico');
  const [title, setTitle] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [fotoBase64, setFotoBase64] = useState(null);
  const [calorias, setCalorias] = useState('');

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
    const fecha = obtenerFechaLocal();
    const body = {
      usuarioId: 'usuario123',
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
    }
  };

  return (
    <div className="formulario">
      <h2 style={{ color: '#388e3c', marginBottom: '1rem' }}>🥗 Registrar nueva comida</h2>

      <label style={{ fontWeight: 'bold' }}>Modo de ingreso:</label>
      <select
        value={modoIngreso}
        onChange={(e) => setModoIngreso(e.target.value)}
        style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
      >
        <option value="automatico">Usar inteligencia artificial</option>
        <option value="manual">Ingreso manual</option>
      </select>

      <label style={{ fontWeight: 'bold' }}>Título de la comida:</label>
      <input
        type="text"
        placeholder="Ej. Sándwich de pollo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
      />

      {modoIngreso === 'automatico' ? (
        <>
          <label style={{ fontWeight: 'bold' }}>Ingredientes:</label>
          <textarea
            rows={5}
            placeholder="Ej: 2 rebanadas de pan\n90g de pollo\n15g de lechuga"
            value={ingredientes}
            onChange={(e) => setIngredientes(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </>
      ) : (
        <>
          <label style={{ fontWeight: 'bold' }}>Calorías (kcal):</label>
          <input
            type="number"
            placeholder="Ej. 230"
            value={calorias}
            onChange={(e) => setCalorias(e.target.value)}
            style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </>
      )}

      <label style={{ fontWeight: 'bold' }}>Foto (opcional):</label>
      <input
        type="file"
        accept="image/*"
        onChange={manejarArchivo}
        style={{ display: 'block', marginBottom: '1rem' }}
      />

      {fotoBase64 && (
        <div style={{ marginBottom: '1rem' }}>
          <img
            src={fotoBase64}
            alt="Vista previa"
            width="120"
            style={{ borderRadius: '10px', border: '2px solid #c8e6c9' }}
          />
        </div>
      )}

      <button
        onClick={enviar}
        style={{ backgroundColor: '#43a047', padding: '0.7rem 1.2rem', borderRadius: '8px', fontWeight: 'bold' }}
      >
        Registrar comida
      </button>
    </div>
  );
}

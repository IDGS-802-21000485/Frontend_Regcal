import { useState } from 'react';
import axios from 'axios';

export default function ComidaForm({ onComidaRegistrada }) {
  const [title, setTitle] = useState('');
  const [ingredientes, setIngredientes] = useState('');
  const [fotoBase64, setFotoBase64] = useState(null);

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
  const offset = fecha.getTimezoneOffset(); // minutos entre UTC y tu zona
  const local = new Date(fecha.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10); // ya en hora local
}



  const enviar = async () => {
    const listaIngredientes = ingredientes
      .split('\n')
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const body = {
      usuarioId: 'usuario123',
      fecha: obtenerFechaLocal(),
      title,
      ingredientes: listaIngredientes,
      foto: fotoBase64,
    };

    try {
      await axios.post('https://backend-regcal.onrender.com/api/comidas', body);
      alert('Comida registrada correctamente');
      onComidaRegistrada(); // para recargar la lista
      setTitle('');
      setIngredientes('');
      setFotoBase64(null);
    } catch (error) {
      console.error(error);
      alert('Error al registrar comida');
    }
  };

  return (
    <div className="formulario">
      <h2>Registrar nueva comida</h2>
      <input
        type="text"
        placeholder="Título de la comida"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br />
      <textarea
        rows={5}
        placeholder="Ingredientes (uno por línea)"
        value={ingredientes}
        onChange={(e) => setIngredientes(e.target.value)}
      /><br />
      <input type="file" accept="image/*" onChange={manejarArchivo} /><br />
      {fotoBase64 && (
        <img src={fotoBase64} alt="Vista previa" width="100" />
      )}
      <button onClick={enviar}>Registrar comida</button>
    </div>
  );
}

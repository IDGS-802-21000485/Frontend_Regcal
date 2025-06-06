import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [ingredientes, setIngredientes] = useState('');
  const [title, setTitle] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [resultado, setResultado] = useState(null);

  const enviarComida = async () => {
    try {
      // Convertir el texto con saltos de línea en arreglo
      const arregloIngredientes = ingredientes
        .split('\n')
        .map((i) => i.trim())
        .filter((i) => i.length > 0);

      const body = {
        usuarioId: 'usuario123',                     // temporal
        fecha: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD"
        title: title || 'Receta personalizada',
        ingredientes: arregloIngredientes,
        foto: fotoUrl || null,
      };

      const res = await axios.post(
        'http://localhost:5000/api/comidas',
        body
      );

      // Validar que exista res.data.comida antes de usarlo
      if (res.data && res.data.comida) {
        setResultado(res.data);
      } else {
        console.error('La respuesta no contiene "comida":', res.data);
        alert('Error: respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error(error);
      alert('Error al registrar la comida');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Registrar comida y calcular calorías</h1>

      <label>Título de la receta:</label><br/>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ej. Sandwich de pollo"
        style={{ width: '300px' }}
      /><br/><br/>

      <label>Ingredientes (uno por línea):</label><br/>
      <textarea
        rows={5}
        cols={40}
        value={ingredientes}
        onChange={(e) => setIngredientes(e.target.value)}
        placeholder={
          "2 cooked chicken breasts\n1 cup chopped lettuce\n1/2 cup grated carrots\n1 tablespoon olive oil\n1/4 teaspoon salt\njuice of 1 lemon"
        }
      /><br/><br/>

      <label>URL de la foto (opcional):</label><br/>
      <input
        type="text"
        value={fotoUrl}
        onChange={(e) => setFotoUrl(e.target.value)}
        placeholder="https://mi-servidor.com/foto.jpg"
        style={{ width: '300px' }}
      /><br/><br/>

      <button onClick={enviarComida}>Calcular y Registrar</button>

      {resultado && resultado.comida && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Resultado:</h2>
          <p><strong>Mensaje:</strong> {resultado.mensaje}</p>
          <p><strong>Comida analizada:</strong> {resultado.comida.title}</p>
          <p><strong>Calorías de esta comida:</strong> {resultado.comida.calorias}</p>
          <p><strong>Proteínas:</strong> {resultado.comida.nutricional.proteins}</p>
          <p><strong>Grasas:</strong> {resultado.comida.nutricional.fats}</p>
          <p><strong>Carbohidratos:</strong> {resultado.comida.nutricional.carbs}</p>
          <p><strong>Azúcares:</strong> {resultado.comida.nutricional.sugars}</p>
          <p><strong>Total de calorías hoy:</strong> {resultado.totalCaloriasDia}</p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const ingresar = async () => {
    try {
      const res = await axios.post('https://backend-regcal.onrender.com/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      onLogin?.(res.data.usuario);
    } catch (err) {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="formulario">
      <h2>Iniciar sesión</h2>
      <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={ingresar}>Ingresar</button>
    </div>
  );
}

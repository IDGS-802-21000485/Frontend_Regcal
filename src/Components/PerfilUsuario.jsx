import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './PerfilUsuario.css';

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState({
    _id: '',
    nombre: '',
    email: '',
    fechaNacimiento: '',
    estatura: '',
    peso: '',
    actividad: 'sedentario',
    objetivo: 'ligero',
    caloriasMantenimiento: 0,
    caloriasObjetivo: 0,
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [editPassword, setEditPassword] = useState(false);

  useEffect(() => {
    cargarUsuario();
  }, []);

  // ✅ SOLO carga datos guardados (NO calcula nada)
  const cargarUsuario = () => {
    try {
      const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
      if (!usuarioStorage?._id) return;

      const data = {
        ...usuarioStorage,
        password: '',
        confirmPassword: ''
      };

      setUsuario(data);
      setOriginalData(data);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      Swal.fire('Error', 'No se pudo cargar la información del usuario', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const hayCambios = () => {
    if (!originalData) return false;

    const campos = [
      'nombre',
      'email',
      'fechaNacimiento',
      'estatura',
      'peso',
      'actividad',
      'objetivo'
    ];

    const cambiosDatos = campos.some(
      campo => usuario[campo] !== originalData[campo]
    );

    const cambiosPassword =
      editPassword && (usuario.password || usuario.confirmPassword);

    return cambiosDatos || cambiosPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (editPassword && usuario.password !== usuario.confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        nombre: usuario.nombre,
        email: usuario.email,
        fechaNacimiento: usuario.fechaNacimiento,
        estatura: usuario.estatura,
        peso: usuario.peso,
        actividad: usuario.actividad,
        objetivo: usuario.objetivo
        // ⚠️ NO enviamos calorías, el backend las maneja
      };

      if (editPassword && usuario.password) {
        payload.password = usuario.password;
      }

      const res = await axios.put(
        `https://backend-regcal.onrender.com/api/auth/update/${usuario._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Actualizar usuario en localStorage
      localStorage.setItem(
        'usuario',
        JSON.stringify(res.data.usuario)
      );

      setUsuario(prev => ({
        ...res.data.usuario,
        password: '',
        confirmPassword: ''
      }));

      setOriginalData(res.data.usuario);
      setEditPassword(false);

      Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        error.response?.data?.mensaje || 'Error al actualizar perfil',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>👤 Perfil de Usuario</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input name="nombre" value={usuario.nombre} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={usuario.email} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={usuario.fechaNacimiento?.split('T')[0] || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estatura (cm)</label>
              <input type="number" name="estatura" value={usuario.estatura} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Peso (kg)</label>
              <input type="number" name="peso" value={usuario.peso} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Nivel de actividad</label>
            <select name="actividad" value={usuario.actividad} onChange={handleChange}>
              <option value="sedentario">Sedentario</option>
              <option value="ligero">Ligero</option>
              <option value="moderado">Moderado</option>
              <option value="activo">Activo</option>
            </select>
          </div>

          <div className="form-group">
            <label>Objetivo</label>
            <select name="objetivo" value={usuario.objetivo} onChange={handleChange}>
              <option value="ligero">Déficit ligero (300 kcal)</option>
              <option value="pesado">Déficit fuerte (500 kcal)</option>
            </select>
          </div>

          {/* ✅ SOLO MOSTRAR calorías guardadas */}
          <div className="resumen-calorias">
            <h3>🔥 Metas calóricas</h3>
            <p><strong>Mantenimiento:</strong> {usuario.caloriasMantenimiento} kcal/día</p>
            <p><strong>Objetivo:</strong> {usuario.caloriasObjetivo} kcal/día</p>
          </div>

          {!editPassword ? (
            <button type="button" className="password-toggle" onClick={() => setEditPassword(true)}>
              Cambiar contraseña
            </button>
          ) : (
            <>
              <input
                type="password"
                placeholder="Nueva contraseña"
                name="password"
                value={usuario.password}
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                name="confirmPassword"
                value={usuario.confirmPassword}
                onChange={handleChange}
              />
            </>
          )}

          <button type="submit" disabled={loading || !hayCambios()}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}

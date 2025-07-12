import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './PerfilUsuario.css';

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    email: '',
    fechaNacimiento: '',
    estatura: '',
    peso: '',
    actividad: 'sedentario',
    objetivo: 'ligero',
    password: '',
    confirmPassword: '',
    caloriasMantenimiento: 0,
    caloriasObjetivo: 0
  });
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [editPassword, setEditPassword] = useState(false);

  useEffect(() => {
    cargarUsuario();
  }, []);

  // Función para calcular las calorías basada en los datos del usuario
  const calcularCalorias = (userData) => {
    // Solo calculamos si tenemos los datos necesarios
    if (!userData.peso || !userData.estatura || !userData.fechaNacimiento) {
      return userData;
    }

    // Calcular edad a partir de la fecha de nacimiento
    const fechaNacimiento = new Date(userData.fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    // Factores de actividad (basados en la ecuación de Harris-Benedict)
    const factoresActividad = {
      sedentario: 1.2,
      ligero: 1.375,
      moderado: 1.55,
      activo: 1.725
    };

    // Cálculo de TMB (Tasa Metabólica Basal) - Fórmula de Mifflin-St Jeor
    const tmb = 10 * userData.peso + 6.25 * userData.estatura - 5 * edad + 5;
    
    // Calorías de mantenimiento
    const caloriasMantenimiento = Math.round(tmb * factoresActividad[userData.actividad]);
    
    // Ajuste según objetivo
    let caloriasObjetivo;
    if (userData.objetivo === 'ligero') {
      caloriasObjetivo = caloriasMantenimiento - 300;
    } else {
      caloriasObjetivo = caloriasMantenimiento - 500;
    }

    return {
      ...userData,
      caloriasMantenimiento,
      caloriasObjetivo
    };
  };

  const cargarUsuario = () => {
    try {
      const usuarioStorage = JSON.parse(localStorage.getItem('usuario'));
      if (!usuarioStorage?._id) return;

      const userData = calcularCalorias({
        ...usuarioStorage,
        password: '',
        confirmPassword: ''
      });
      
      setUsuario(userData);
      setOriginalData(userData);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cargar la información del usuario',
        icon: 'error',
        confirmButtonColor: '#2c3e50'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => {
      const newUser = { ...prev, [name]: value };
      
      // Recalcular calorías si cambian datos relevantes
      if (['peso', 'estatura', 'actividad', 'objetivo', 'fechaNacimiento'].includes(name)) {
        return calcularCalorias(newUser);
      }
      return newUser;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validar contraseñas si está en modo edición
    if (editPassword && usuario.password !== usuario.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonColor: '#2c3e50'
      });
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
        objetivo: usuario.objetivo,
        caloriasMantenimiento: usuario.caloriasMantenimiento,
        caloriasObjetivo: usuario.caloriasObjetivo
      };

      // Solo incluir password si está en modo edición y no está vacío
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

      // Actualizar localStorage si hay nuevo token
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      // Actualizar datos de usuario en localStorage
      const updatedUser = { 
        ...JSON.parse(localStorage.getItem('usuario')), 
        ...res.data.usuario 
      };
      localStorage.setItem('usuario', JSON.stringify(updatedUser));

      Swal.fire({
        title: '¡Datos actualizados!',
        text: 'Tu información se ha guardado correctamente',
        icon: 'success',
        confirmButtonColor: '#2c3e50',
        timer: 2000,
        timerProgressBar: true
      });

      // Resetear campos de contraseña
      setUsuario(prev => ({ ...prev, password: '', confirmPassword: '' }));
      setEditPassword(false);
      setOriginalData(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.mensaje || 'Error al actualizar los datos',
        icon: 'error',
        confirmButtonColor: '#2c3e50'
      });
    } finally {
      setLoading(false);
    }
  };

  const hayCambios = () => {
    if (!originalData) return false;
    
    const camposBasicos = ['nombre', 'email', 'fechaNacimiento', 'estatura', 'peso', 'actividad', 'objetivo'];
    const cambiosBasicos = camposBasicos.some(key => usuario[key] !== originalData[key]);
    
    const cambiosPassword = editPassword && (usuario.password || usuario.confirmPassword);
    
    return cambiosBasicos || cambiosPassword;
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <h2>✏️ Editar Perfil</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={usuario.fechaNacimiento?.split('T')[0] || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estatura (cm)</label>
              <input
                type="number"
                name="estatura"
                value={usuario.estatura}
                onChange={handleChange}
                min="100"
                max="250"
                required
              />
            </div>

            <div className="form-group">
              <label>Peso (kg)</label>
              <input
                type="number"
                name="peso"
                value={usuario.peso}
                onChange={handleChange}
                min="30"
                max="300"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nivel de actividad</label>
            <select
              name="actividad"
              value={usuario.actividad}
              onChange={handleChange}
              required
            >
              <option value="sedentario">Sedentario (poco o ningún ejercicio)</option>
              <option value="ligero">Ligero (ejercicio ligero 1-3 días/semana)</option>
              <option value="moderado">Moderado (ejercicio moderado 3-5 días/semana)</option>
              <option value="activo">Activo (ejercicio intenso 6-7 días/semana)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Objetivo</label>
            <select
              name="objetivo"
              value={usuario.objetivo}
              onChange={handleChange}
              required
            >
              <option value="ligero">Déficit ligero (300 kcal menos)</option>
              <option value="pesado">Déficit fuerte (500 kcal menos)</option>
            </select>
          </div>

          {!editPassword ? (
            <button
              type="button"
              className="password-toggle"
              onClick={() => setEditPassword(true)}
            >
              Cambiar contraseña
            </button>
          ) : (
            <div className="password-fields">
              <div className="form-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={usuario.password}
                  onChange={handleChange}
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={usuario.confirmPassword}
                  onChange={handleChange}
                  minLength="6"
                />
              </div>

              <button
                type="button"
                className="password-toggle"
                onClick={() => {
                  setEditPassword(false);
                  setUsuario(prev => ({ ...prev, password: '', confirmPassword: '' }));
                }}
              >
                Cancelar cambio
              </button>
            </div>
          )}

          {usuario.caloriasObjetivo && (
            <div className="resumen-calorias">
              <h3>Metas calóricas</h3>
              <p><strong>Mantenimiento:</strong> {usuario.caloriasMantenimiento} kcal/día</p>
              <p><strong>Tu objetivo:</strong> {usuario.caloriasObjetivo} kcal/día</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !hayCambios()}
            className="submit-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span> Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
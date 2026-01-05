import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ComidaForm({ usuarioId, onComidaRegistrada }) {
  const [tipo, setTipo] = useState("manual");

  const [title, setTitle] = useState("");
  const [calorias, setCalorias] = useState("");
  const [foto, setFoto] = useState(null);

  const [recetas, setRecetas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [seleccionId, setSeleccionId] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================
     Cargar recetas y productos
  ========================= */
  useEffect(() => {
    if (!usuarioId) return;

    const cargar = async () => {
      try {
        const [r, p] = await Promise.all([
          axios.get(
            `https://backend-regcal.onrender.com/api/recetas?usuarioId=${usuarioId}`
          ),
          axios.get(
            `https://backend-regcal.onrender.com/api/alimentos-procesados?usuarioId=${usuarioId}`
          ),
        ]);

        setRecetas(r.data || []);
        setProductos(p.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    cargar();
  }, [usuarioId]);

  /* ========================= */
  const fechaHoy = () => new Date().toISOString().slice(0, 10);

  const manejarImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  };

  /* =========================
     Enviar comida
  ========================= */
  const enviar = async () => {
    setLoading(true);

    try {
      let payload;

      if (tipo === "manual") {
        if (!title || !calorias) {
          Swal.fire("Error", "Completa los datos", "error");
          return;
        }

        payload = {
          usuarioId,
          fecha: fechaHoy(),
          title,
          foto,
          calorias: Number(calorias),
          nutricional: {
            calories: Number(calorias),
            proteins: 0,
            fats: 0,
            carbs: 0,
            sugars: 0,
          },
        };
      }

      if (tipo === "receta") {
        const receta = recetas.find(r => r._id === seleccionId);
        if (!receta) {
          Swal.fire("Error", "Selecciona una receta", "error");
          return;
        }

        payload = {
          usuarioId,
          fecha: fechaHoy(),
          title: receta.nombre,
          foto: receta.imagen || null,
          calorias: receta.nutricional.calories,
          nutricional: receta.nutricional,
        };
      }

      if (tipo === "producto") {
        const prod = productos.find(p => p._id === seleccionId);
        if (!prod) {
          Swal.fire("Error", "Selecciona un producto", "error");
          return;
        }

        payload = {
          usuarioId,
          fecha: fechaHoy(),
          title: prod.nombre,
          foto: prod.foto || null,
          calorias: prod.nutricional.calories,
          nutricional: prod.nutricional,
        };
      }

      await axios.post(
        "https://backend-regcal.onrender.com/api/comidas/manual",
        payload
      );

      Swal.fire("✅ Listo", "Comida registrada", "success");

      setTitle("");
      setCalorias("");
      setFoto(null);
      setSeleccionId("");

      onComidaRegistrada?.();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo registrar", "error");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI MEJORADA
  ========================= */
  return (
    <div className="form-card">
      <h2>🍽 Registrar comida</h2>
      <p style={{ opacity: 0.7, marginBottom: 16 }}>
        Elige cómo quieres registrar tu comida
      </p>

      {/* Selector tipo */}
      <div className="form-group">
        <label>Tipo de registro</label>
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="manual">✍️ Manual</option>
          <option value="receta">📖 Receta guardada</option>
          <option value="producto">🏷 Producto procesado</option>
        </select>
      </div>

      {/* Manual */}
      {tipo === "manual" && (
        <>
          <div className="form-group">
            <label>Nombre de la comida</label>
            <input
              placeholder="Ej. Desayuno, cena, snack…"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Calorías</label>
            <input
              type="number"
              placeholder="Ej. 350"
              value={calorias}
              onChange={e => setCalorias(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Foto (opcional)</label>
            <input type="file" accept="image/*" onChange={manejarImagen} />
          </div>
        </>
      )}

      {/* Receta */}
      {tipo === "receta" && (
        <div className="form-group">
          <label>Selecciona una receta</label>
          <select
            value={seleccionId}
            onChange={e => setSeleccionId(e.target.value)}
          >
            <option value="">— Selecciona —</option>
            {recetas.map(r => (
              <option key={r._id} value={r._id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Producto */}
      {tipo === "producto" && (
        <div className="form-group">
          <label>Selecciona un producto</label>
          <select
            value={seleccionId}
            onChange={e => setSeleccionId(e.target.value)}
          >
            <option value="">— Selecciona —</option>
            {productos.map(p => (
              <option key={p._id} value={p._id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={enviar}
        disabled={loading}
        className="btn-primary"
        style={{ marginTop: 12 }}
      >
        {loading ? "Registrando..." : "Guardar comida"}
      </button>
    </div>
  );
}

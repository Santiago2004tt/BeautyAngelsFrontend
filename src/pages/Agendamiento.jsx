import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Agendamiento() {
  const navigate = useNavigate();
  const { diseno_id } = useParams();
  const [diseno, setDiseno] = useState(null);
  const [loading, setLoading] = useState(true);

  // calendario y horas
  const [fecha, setFecha] = useState("");
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [hora, setHora] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // tintes
  const [tintes, setTintes] = useState([]);
  const [tintesSeleccionados, setTintesSeleccionados] = useState([]);

  // usuario desde sesión
  const session = JSON.parse(localStorage.getItem("session"));
  const usuario_id = session?.user?.id;

  // Cargar diseño
  useEffect(() => {
    const fetchDiseno = async () => {
      try {
        const res = await fetch(`https://beautyangelsbackend.onrender.com/diseno/get_diseno/${diseno_id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Error al obtener diseño");
        setDiseno(data.diseno);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDiseno();
  }, [diseno_id]);

  // Obtener horas disponibles
  useEffect(() => {
    if (!fecha) return;
    const fetchHoras = async () => {
      try {
        setError("");
        setHora("");
        const res = await fetch(
          `https://beautyangelsbackend.onrender.com/agendamiento/horas_disponibles?fecha=${fecha}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Error al obtener horas disponibles");
        setHorasDisponibles(data.horas);
        if (data.horas.length === 0) setError("No hay horarios disponibles para esta fecha");
      } catch (err) {
        console.error(err);
        setError("Error al cargar horarios. Intenta de nuevo.");
      }
    };
    fetchHoras();
  }, [fecha]);

  // Obtener tintes
  useEffect(() => {
    const fetchTintes = async () => {
      try {
        const res = await fetch(`https://beautyangelsbackend.onrender.com/diseno/get_tintes`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Error al obtener tintes");
        setTintes(data.tintes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTintes();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Cargando diseño...</p>;
  if (!diseno) return <p className="p-6 text-red-500">No se encontró el diseño</p>;

  // deshabilitar domingos y días pasados
  const minDate = new Date().toISOString().split("T")[0];

  const handleFechaChange = (e) => {
    const value = e.target.value;
    const day = new Date(value).getDay();
    if (day === 6) {
      setError("No se puede agendar en domingos.");
      setFecha("");
    } else {
      setError("");
      setFecha(value);
    }
  };

  const seleccionarTinte = (tinte) => {
    const yaSeleccionado = tintesSeleccionados.some((t) => t.id === tinte.id);

    if (yaSeleccionado) {
      setTintesSeleccionados((prev) => prev.filter((t) => t.id !== tinte.id));
    } else {
      if (tintesSeleccionados.length < diseno.max_tintes) {
        setTintesSeleccionados((prev) => [...prev, tinte]);
      }
    }
  };

  // 👉 función para enviar al backend
  const handleAgendar = async () => {
    try {
      setMensaje("");

      if (!usuario_id || !fecha || !hora) {
        setMensaje("❌ Faltan datos obligatorios.");
        return;
      }

      const body = {
        usuario_id,
        diseno_id, // asegurar que va como número
        fecha,
        hora,
        tintes_ids: tintesSeleccionados.map((t) => t.id), // 👈 ahora siempre mandamos tintes
        max_tintes: diseno.max_tintes, // enviar el máximo permitido
      };

      console.log("Payload enviado:", body);

      const res = await fetch("https://beautyangelsbackend.onrender.com/agendamiento/crear_agendamiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Error al crear agendamiento");

      setMensaje(`✅ Agendamiento creado`);
      // opcional: redirigir después de 2 segs
      // setTimeout(() => navigate("/home"), 2000);
      setTimeout(()=>navigate("/home"),2000)
    } catch (err) {
      console.error(err);
      setMensaje("❌ " + err.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
  {/* Botón atrás */}
  <button
    onClick={() => navigate("/home")}
    className="flex items-center text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
  >
    ⬅ ATRAS
  </button>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    {/* Columna izquierda: diseño */}
    <div className="border rounded-lg p-4">
      <div className="flex justify-center">
        <img
          src={diseno.imagen}
          alt={diseno.nombre}
          className="w-32 h-32 object-cover rounded-full border"
        />
      </div>
      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <p><strong>Nombre:</strong> {diseno.nombre}</p>
        <p><strong>Descripción:</strong> {diseno.descripcion}</p>
        <p><strong>Máx de tintes:</strong> {diseno.max_tintes}</p>
        <p><strong>Precio estimado:</strong> {diseno.precio_estimado}</p>
      </div>
    </div>

    {/* Columna central: fecha y hora */}
    <div className="flex flex-col space-y-4">
      <input
        type="date"
        min={minDate}
        value={fecha}
        onChange={handleFechaChange}
        className="border rounded-md px-3 py-2 text-sm"
      />

      <select
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        disabled={!fecha || horasDisponibles.length === 0}
        className="border rounded-md px-3 py-2 text-sm"
      >
        <option value="">-- Selecciona hora --</option>
        {horasDisponibles.map((h, i) => (
          <option key={i} value={h}>{h}</option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        onClick={handleAgendar}
        disabled={!fecha || !hora}
        className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600 disabled:bg-gray-400"
      >
        Agendar
      </button>

      {mensaje && <p className="text-sm mt-2">{mensaje}</p>}
    </div>

    {/* Columna derecha: tintes */}
    <div className="space-y-4">
      <div className="border rounded-lg p-4 text-sm">
        <p><strong>Seleccionar tintes</strong></p>
        <p className="text-xs text-gray-500">
          {tintesSeleccionados.length} / {diseno.max_tintes} seleccionados
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {tintes.map((t) => {
            const seleccionado = tintesSeleccionados.some((sel) => sel.id === t.id);
            const limiteAlcanzado = tintesSeleccionados.length >= diseno.max_tintes;

            return (
              <div
                key={t.id}
                onClick={() => {
                  if (!seleccionado && limiteAlcanzado) return;
                  seleccionarTinte(t);
                }}
                className={`border rounded-md p-2 flex flex-col items-center 
                  ${seleccionado ? "border-blue-500 bg-blue-50" : "hover:bg-gray-100"} 
                  ${!seleccionado && limiteAlcanzado ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <img
                  src={t.imagen}
                  alt={t.nombre}
                  className="w-16 h-16 object-cover rounded-full"
                />
                <p className="mt-1 text-xs">{t.nombre}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border rounded-lg p-4 text-sm">
        <p><strong>Tintes seleccionados:</strong></p>
        <ul className="mt-2 space-y-1">
          {tintesSeleccionados.map((t) => (
            <li key={t.id} className="flex justify-between items-center">
              <span>{t.nombre}</span>
              <button
                onClick={() =>
                  setTintesSeleccionados((prev) => prev.filter((sel) => sel.id !== t.id))
                }
                className="text-red-500"
              >
                x
              </button>
            </li>
          ))}
          {tintesSeleccionados.length === 0 && (
            <li className="text-gray-400">Ningún tinte seleccionado</li>
          )}
        </ul>
      </div>
    </div>
  </div>
</div>
  );
}

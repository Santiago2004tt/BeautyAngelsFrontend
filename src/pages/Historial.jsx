import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { API } from "../config";

export default function HistorialCitas() {
  const [agendamientos, setAgendamientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ useCallback evita que React recree la función en cada render
  const fetchAgendamientos = useCallback(async () => {
    try {
      const session = JSON.parse(localStorage.getItem("session"));
      if (!session || !session.user?.id) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API}/user/obtener_agendamientos/${session.user.id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Error al obtener citas");
      setAgendamientos(data.agendamientos || []);
    } catch (error) {
      console.error("❌ Error al cargar citas:", error);
    }
  }, [navigate]); // solo depende de navigate

  useEffect(() => {
    fetchAgendamientos();
  }, [fetchAgendamientos]); // ✅ dependencias correctas

  // ===============================
  // 🔹 Cancelar una cita
  // ===============================
  const cancelarCita = async (agendamiento_id) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar esta cita?");
    if (!confirmar) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/agendamiento/cancelar_agendamiento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agendamiento_id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Error al cancelar la cita");

      alert("✅ Cita cancelada exitosamente.");
      fetchAgendamientos(); // recarga la lista actualizada
    } catch (error) {
      console.error("❌ Error al cancelar cita:", error);
      alert("❌ No se pudo cancelar la cita.");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 🔹 Render
  // ===============================
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ← Atrás
        </button>
        <h1 className="ml-4 text-2xl font-bold text-gray-800">Historial de citas</h1>
      </div>

      {/* Lista de citas */}
      <div className="flex flex-col gap-4">
        {agendamientos.length === 0 ? (
          <p className="text-gray-600 text-center mt-10">
            No tienes citas registradas.
          </p>
        ) : (
          agendamientos.map((cita) => (
            <div
              key={cita.id}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-800 font-medium">Fecha: {cita.fecha}</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    cita.estado === "pendiente"
                      ? "bg-yellow-100 text-yellow-700"
                      : cita.estado === "completado"
                      ? "bg-green-100 text-green-700"
                      : cita.estado === "cancelado"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {cita.estado}
                </span>
              </div>

              <p className="text-gray-700">Hora: {cita.hora}</p>
              <p className="text-gray-500 text-sm mt-2">
                Creado en: {new Date(cita.creado_en).toLocaleString()}
              </p>

              {/* Botón de cancelar solo si está pendiente */}
              {cita.estado === "pendiente" && (
                <button
                  onClick={() => cancelarCita(cita.id)}
                  disabled={loading}
                  className={`mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Cancelando..." : "Cancelar cita"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

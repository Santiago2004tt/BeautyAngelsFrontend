import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../config";

export default function DetalleAgendamientoAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agendamiento, setAgendamiento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // =============================
  // Cargar información del agendamiento
  // =============================
  const obtenerDetalle = async () => {
    setMensaje("");
    setAgendamiento(null);

    if (!id) {
      setMensaje("ID inválido (no se recibió id en la ruta).");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/admin/obtener_agendamiento_detallado_admin/${encodeURIComponent(id)}`);
      const contenidoText = await res.text();

      let data = null;
      try {
        data = contenidoText ? JSON.parse(contenidoText) : null;
      } catch {
        throw new Error("Respuesta del servidor no es JSON válido.");
      }

      if (!res.ok) {
        const detalle = data?.detail || data?.message || "Error en el servidor";
        throw new Error(detalle);
      }

      const ag = data?.agendamiento ?? null;
      if (!ag) throw new Error("El servidor no devolvió el campo 'agendamiento'.");

      if (!Array.isArray(ag.tintes)) ag.tintes = [];

      setAgendamiento(ag);
    } catch (e) {
      console.error("Error al obtener detalle:", e);
      setMensaje(e.message || "Error al cargar el agendamiento.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Cambiar estado (Aceptar / Cancelar)
  // =============================
  const cambiarEstado = async (nuevoEstado) => {
    if (!window.confirm(`¿Seguro que deseas cambiar el estado a "${nuevoEstado}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API}/admin/cambiar_estado_agendamiento_admin/${encodeURIComponent(id)}/${encodeURIComponent(nuevoEstado)}`,
        { method: "POST" }
      );

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        const detalle = data?.detail || data?.message || "Error al cambiar estado";
        throw new Error(detalle);
      }

      navigate("/admin_panel");
    } catch (e) {
      console.error("Error al cambiar estado:", e);
      alert(e.message || "No se pudo cambiar el estado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDetalle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // =============================
  // Renderizado
  // =============================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-gray-600">
        Cargando información...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Detalle del Agendamiento</h1>
          <div className="flex gap-2">
            <button
              onClick={obtenerDetalle}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Reintentar
            </button>
            <button
              onClick={() => navigate("/admin_panel")}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
            >
              Volver
            </button>
          </div>
        </div>

        {mensaje && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
            {mensaje}
          </div>
        )}

        {!agendamiento ? (
          <div className="text-gray-600">No hay datos para mostrar.</div>
        ) : (
          <>
            <div className="space-y-2 mb-6">
              <p><strong>Cliente:</strong> {agendamiento.usuario_nombre}</p>
              <p><strong>Fecha:</strong> {agendamiento.fecha}</p>
              <p><strong>Hora:</strong> {agendamiento.hora}</p>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  className={`font-semibold ${
                    agendamiento.estado === "pendiente"
                      ? "text-blue-600"
                      : agendamiento.estado === "expiro"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {agendamiento.estado}
                </span>
              </p>
              <p><strong>Descripción del diseño:</strong> {agendamiento.diseno_descripcion}</p>
              <p>
                <strong>Precio estimado:</strong>{" "}
                {agendamiento.precio_estimado
                  ? `$${Number(agendamiento.precio_estimado).toLocaleString()}`
                  : "N/A"}
              </p>
            </div>

            {/* ====== Lista de tintes ====== */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Tintes asociados</h2>
              {agendamiento.tintes.length === 0 ? (
                <p className="text-gray-600">No hay tintes asociados.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {agendamiento.tintes.map((tinte) => (
                    <div
                      key={tinte.id}
                      className="border rounded-xl p-3 bg-gray-50 shadow-sm flex flex-col items-center"
                    >
                      {tinte.imagen ? (
                        <img
                          src={tinte.imagen}
                          alt={tinte.nombre || "tinte"}
                          className="w-24 h-24 object-cover rounded-lg mb-2"
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24'%3E%3Crect fill='%23e5e7eb' width='24' height='24'/%3E%3Ctext x='50%' y='50%' font-size='10' text-anchor='middle' fill='%23777' dy='.3em'%3Eno image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded mb-2 flex items-center justify-center text-sm text-gray-600">
                          sin foto
                        </div>
                      )}
                      <p className="font-medium text-center">{tinte.nombre}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ====== Botones ====== */}
            <div className="flex justify-end gap-2">
              {agendamiento.estado === "pendiente" && (
                <>
                  <button
                    onClick={() => cambiarEstado("cancelado")}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => cambiarEstado("aceptado")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Aceptar
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

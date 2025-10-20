import { useEffect, useState } from "react";
import { API } from "../config";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [vista, setVista] = useState("agendamientos");
  const [agendamientos, setAgendamientos] = useState([]);
  const [tintes, setTintes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // =============================
  // AGENDAMIENTOS
  // =============================
  const obtenerAgendamientos = async () => {
    const session = JSON.parse(localStorage.getItem("session_admin"));
    if (!session || !session.user?.id) {
      navigate("/");
      return;
    }
    try {
      setLoading(true);
      setMensaje("");
      const res = await fetch(`${API}/admin/get_agendamientos_admin`);
      if (!res.ok) throw new Error("Error al obtener agendamientos");
      const data = await res.json();
      setAgendamientos(data.agendamientos || []);
      setPendientes([]);
    } catch {
      setMensaje("No se pudieron cargar agendamientos.");
    } finally {
      setLoading(false);
    }
  };

  const obtenerPendientes = async () => {
    try {
      setLoading(true);
      setMensaje("");
      const res = await fetch(`${API}/admin/get_agendamientos_pendiente_admin`);
      if (!res.ok) throw new Error("Error al obtener pendientes");
      const data = await res.json();
      setPendientes(data.agendamientos || []);
      setAgendamientos([]);
    } catch {
      setMensaje("No se pudieron cargar pendientes.");
    } finally {
      setLoading(false);
    }
  };

  const buscarPorNombre = async () => {
    try {
      setMensaje("");
      const q = busqueda.trim();
      if (!q) {
        await obtenerAgendamientos();
        return;
      }

      setLoading(true);
      const res = await fetch(
        `${API}/admin/get_agendamiento_por_nombre_admin/${encodeURIComponent(q)}`
      );

      if (res.status === 404) {
        setAgendamientos([]);
        setMensaje("No se encontró ningún agendamiento con ese nombre.");
        return;
      }
      if (!res.ok) throw new Error("Error en la búsqueda");

      const data = await res.json();
      const resultados = data.agendamiento || [];
      setAgendamientos(resultados);
      setPendientes([]);
      if (resultados.length === 0)
        setMensaje("No se encontró ningún agendamiento con ese nombre.");
    } catch {
      setMensaje("Error en la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const expirarCitas = async () => {
    try {
      setLoading(true);
      setMensaje("");
      const res = await fetch(
        `${API}/admin/actualizar_agendamientos_expirados_admin`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Error al expirar citas");
      await obtenerAgendamientos();
      setMensaje("Agendamientos expirados actualizados.");
    } catch {
      setMensaje("No se pudieron expirar citas.");
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      setLoading(true);
      setMensaje("");
      const res = await fetch(
        `${API}/admin/cambiar_estado_agendamiento_admin/${encodeURIComponent(id)}/${encodeURIComponent(estado)}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Error al cambiar estado");
      if (pendientes.length > 0) {
        obtenerPendientes();
      } else {
        obtenerAgendamientos();
      }
    } catch {
      setMensaje("No se pudo cambiar el estado.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // TINTES
  // =============================
  const obtenerTintes = async () => {
    try {
      setLoading(true);
      setMensaje("");
      const res = await fetch(`${API}/admin/get_tintes_admin`);
      if (!res.ok) throw new Error("Error al obtener tintes");
      const data = await res.json();
      setTintes(data.tintes || []);
    } catch {
      setMensaje("No se pudieron cargar tintes.");
    } finally {
      setLoading(false);
    }
  };

  const modificarCantidad = async (id, cantidad) => {
    try {
      setLoading(true);
      setMensaje("");
      const res = await fetch(
        `${API}/admin/modificar_cantidad_tinte/${encodeURIComponent(id)}/${encodeURIComponent(cantidad)}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Error al modificar cantidad");
      await obtenerTintes();
      setMensaje("Cantidad modificada.");
    } catch {
      setMensaje("No se pudo modificar la cantidad.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerAgendamientos();
    obtenerTintes();
  }, []);

  useEffect(() => {
    if (busqueda.trim() === "") {
      obtenerAgendamientos();
    }
  }, [busqueda]);

  // =============================
  // RENDER
  // =============================
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white shadow-lg flex-col justify-between">
        <div>
          <button
            onClick={() => {
              setVista("agendamientos");
              obtenerAgendamientos();
            }}
            className={`w-full p-4 text-left border-b hover:bg-gray-200 ${
              vista === "agendamientos" && "bg-gray-200 font-bold"
            }`}
          >
            Agendamientos
          </button>
          <button
            onClick={() => {
              setVista("tintes");
              obtenerTintes();
            }}
            className={`w-full p-4 text-left border-b hover:bg-gray-200 ${
              vista === "tintes" && "bg-gray-200 font-bold"
            }`}
          >
            Tintes
          </button>
        </div>
        <button
          onClick={() => navigate("/")}
          className="m-4 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Salir
        </button>
      </aside>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col justify-between z-50"
          >
            <div>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setVista("agendamientos");
                  obtenerAgendamientos();
                }}
                className={`w-full p-4 text-left border-b hover:bg-gray-200 ${
                  vista === "agendamientos" && "bg-gray-200 font-bold"
                }`}
              >
                Agendamientos
              </button>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setVista("tintes");
                  obtenerTintes();
                }}
                className={`w-full p-4 text-left border-b hover:bg-gray-200 ${
                  vista === "tintes" && "bg-gray-200 font-bold"
                }`}
              >
                Tintes
              </button>
            </div>
            <button
              onClick={() => {
                setSidebarOpen(false);
                navigate("/");
              }}
              className="m-4 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Salir
            </button>
          </aside>
        </div>
      )}

      {/* Contenido */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Header móvil */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h1 className="text-lg font-semibold text-gray-800">
            Panel Admin - {vista === "tintes" ? "Tintes" : "Agendamientos"}
          </h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-gray-700 text-white rounded-md"
          >
            ☰
          </button>
        </div>

        {vista === "agendamientos" ? (
          <div className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border p-2 rounded-lg w-full sm:w-1/3 text-sm"
                onKeyDown={(e) => e.key === "Enter" && buscarPorNombre()}
              />
              <button
                onClick={buscarPorNombre}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-800"
              >
                Buscar
              </button>
              <button
                onClick={() => {
                  setBusqueda("");
                  obtenerAgendamientos();
                }}
                className="bg-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-300"
              >
                Limpiar
              </button>
              <button
                onClick={expirarCitas}
                className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600"
              >
                Expirar
              </button>
              <button
                onClick={obtenerPendientes}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600"
              >
                Pendientes
              </button>
            </div>

            {loading && <p className="text-sm text-gray-600">Cargando...</p>}
            {mensaje && <p className="text-sm text-red-600">{mensaje}</p>}

            {(pendientes.length > 0 ? pendientes : agendamientos).length === 0 ? (
              <p className="text-gray-600 text-sm">No hay agendamientos.</p>
            ) : (
              (pendientes.length > 0 ? pendientes : agendamientos).map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => navigate(`/admin/agendamiento/${ag.id}`)}
                  className="border rounded-xl p-4 bg-white shadow-sm cursor-pointer hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <div className="text-sm">
                    <p>
                      <strong>Fecha:</strong> {ag.fecha} — <strong>Hora:</strong>{" "}
                      {ag.hora}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      <span
                        className={`${
                          ag.estado === "pendiente"
                            ? "text-blue-600"
                            : ag.estado === "expiro"
                            ? "text-red-600"
                            : "text-green-600"
                        } font-semibold`}
                      >
                        {ag.estado}
                      </span>
                    </p>
                  </div>

                  {ag.estado === "pendiente" && (
                    <div className="flex gap-2 mt-3 sm:mt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cambiarEstado(ag.id, "cancelado");
                        }}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          cambiarEstado(ag.id, "aceptado");
                        }}
                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-600"
                      >
                        Aceptar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {tintes.length === 0 && (
              <p className="text-gray-600 text-sm">No hay tintes.</p>
            )}
            {tintes.map((t) => (
              <div
                key={t.id}
                className="border rounded-xl p-4 bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={t.imagen}
                    alt={t.nombre}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                  <div>
                    <p className="font-semibold text-sm sm:text-base">
                      {t.nombre}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {t.descripcion}
                    </p>
                    <p className="text-sm">
                      <strong>Cantidad:</strong> {t.cant}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Número"
                    className="border p-2 rounded-lg w-24 text-sm"
                    id={`cant-${t.id}`}
                  />
                  <button
                    onClick={() => {
                      const valor = document.getElementById(`cant-${t.id}`).value;
                      if (!valor) return alert("Ingresa un número");
                      modificarCantidad(t.id, Number(valor));
                    }}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"
                  >
                    Modificar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

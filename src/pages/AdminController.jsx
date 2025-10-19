import { useEffect, useState } from "react";
import { API } from "../config";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const [vista, setVista] = useState("agendamientos"); // 'agendamientos' | 'tintes'
  const [agendamientos, setAgendamientos] = useState([]);
  const [tintes, setTintes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
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
    } catch (e) {
      console.error(e);
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
      setAgendamientos([]); // para evitar mezclar ambos arrays en la vista
    } catch (e) {
      console.error(e);
      setMensaje("No se pudieron cargar pendientes.");
    } finally {
      setLoading(false);
    }
  };

  // Busca por nombre; si busqueda está vacía recarga todo
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

      // Si backend responde 404 o similar, tomarlo en cuenta:
      if (res.status === 404) {
        setAgendamientos([]);
        setMensaje("No se encontró ningún agendamiento con ese nombre.");
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Error en la búsqueda");
      }

      const data = await res.json();
      // backend devuelve el array bajo "agendamiento"
      const resultados = data.agendamiento || [];
      setAgendamientos(resultados);
      setPendientes([]); // limpiamos pendientes si había
      if (resultados.length === 0) {
        setMensaje("No se encontró ningún agendamiento con ese nombre.");
      }
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
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
        `${API}/admin/cambiar_estado_agendamiento_admin/${encodeURIComponent(id)}/${encodeURIComponent(
          estado
        )}`,
        { method: "POST" }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Error al cambiar estado");
      }
      // actualizar la lista actual (no forzar recarga si estás viendo pendientes)
      if (pendientes.length > 0) {
        obtenerPendientes();
      } else {
        obtenerAgendamientos();
      }
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
      setMensaje("No se pudieron cargar tintes.");
    } finally {
      setLoading(false);
    }
  };

  const modificarCantidad = async (id, cantidad) => {
    try {
      setLoading(true);
      setMensaje("");
      // aceptar números positivos o negativos (el backend ya lo maneja)
      const res = await fetch(
        `${API}/admin/modificar_cantidad_tinte/${encodeURIComponent(id)}/${encodeURIComponent(
          cantidad
        )}`,
        { method: "POST" }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Error al modificar cantidad");
      }
      await obtenerTintes();
      setMensaje("Cantidad modificada.");
    } catch (e) {
      console.error(e);
      setMensaje("No se pudo modificar la cantidad.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // EFECTO INICIAL
  // =============================
  useEffect(() => {
    obtenerAgendamientos();
    obtenerTintes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Si se borra la búsqueda manualmente (tecla), recargar resultados:
  useEffect(() => {
    if (busqueda.trim() === "") {
      // recarga completa cuando el campo se vacía
      obtenerAgendamientos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  // =============================
  // RENDERIZADO
  // =============================
  return (
    <div className="flex h-screen bg-gray-100">
      {/* PANEL LATERAL */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between">
        <div>
          <button
            onClick={() => {
              setVista("agendamientos");
              obtenerAgendamientos();
            }}
            className={`w-full p-4 text-left border-b hover:bg-gray-200 ${vista === "agendamientos" && "bg-gray-200 font-bold"
              }`}
          >
            Agendamientos
          </button>
          <button
            onClick={() => {
              setVista("tintes");
              obtenerTintes();
            }}
            className={`w-full p-4 text-left border-b hover:bg-gray-200 ${vista === "tintes" && "bg-gray-200 font-bold"
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

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 overflow-y-auto">
        {vista === "agendamientos" ? (
          <div className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border p-2 rounded-lg w-1/3"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    buscarPorNombre();
                  }
                }}
              />
              <button
                onClick={buscarPorNombre}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
              >
                Buscar
              </button>
              <button
                onClick={() => {
                  setBusqueda("");
                  obtenerAgendamientos();
                }}
                className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300"
              >
                Limpiar
              </button>

              <button
                onClick={expirarCitas}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Expirar Citas
              </button>
              <button
                onClick={obtenerPendientes}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Pendientes
              </button>
            </div>

            {loading && <p className="text-sm text-gray-600">Cargando...</p>}
            {mensaje && <p className="text-sm text-red-600">{mensaje}</p>}

            {/* Lista de agendamientos (ID oculto) */}
            {(pendientes.length > 0 ? pendientes : agendamientos).length === 0 ? (
              <p className="text-gray-600">No hay agendamientos para mostrar.</p>
            ) : (
              (pendientes.length > 0 ? pendientes : agendamientos).map((ag) => (
                <div
                  key={ag.id}
                  onClick={() => navigate(`/admin/agendamiento/${ag.id}`)}
                  className="border rounded-xl p-4 flex justify-between items-center bg-white shadow-sm cursor-pointer hover:shadow-md transition"
                >

                  <div>
                    {/* ID oculto: no renderizamos en la UI */}
                    <p>
                      <strong>Fecha:</strong> {ag.fecha} — <strong>Hora:</strong>{" "}
                      {ag.hora}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      <span
                        className={`${ag.estado === "pendiente"
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

                  {/* Mostrar botones solo si el estado es pendiente */}
                  {ag.estado === "pendiente" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => cambiarEstado(ag.id, "cancelado")}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => cambiarEstado(ag.id, "aceptado")}
                        className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
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
          // =============================
          // TINTES
          // =============================
          <div className="space-y-4">
            {tintes.length === 0 && <p className="text-gray-600">No hay tintes.</p>}
            {tintes.map((t) => (
              <div
                key={t.id}
                className="border rounded-xl p-4 flex justify-between items-center bg-white shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={t.imagen}
                    alt={t.nombre}
                    className="w-16 h-16 rounded-lg object-cover border"
                  />
                  <div>
                    <p className="font-semibold">{t.nombre}</p>
                    <p className="text-gray-600">{t.descripcion}</p>
                    <p>
                      <strong>Cantidad:</strong> {t.cant}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Agregar número"
                    className="border p-2 rounded-lg w-24"
                    id={`cant-${t.id}`}
                  />
                  <button
                    onClick={() => {
                      const valor = document.getElementById(`cant-${t.id}`).value;
                      if (!valor) return alert("Ingresa un número");
                      modificarCantidad(t.id, Number(valor));
                    }}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
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

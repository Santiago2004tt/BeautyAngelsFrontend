import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [disenos, setDisenos] = useState([]);
  const navigate = useNavigate();
  const cita = null;

  useEffect(() => {
    const fetchUserData = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      if (!session || !session.user?.id) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `https://beautyangelsbackend.onrender.com/user/get_user_name/${session.user.id}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Error al obtener usuario");

        setUserName(data.nombre);

        const resDisenos = await fetch("https://beautyangelsbackend.onrender.com/diseno/get_disenos");
        const dataDisenos = await resDisenos.json();
        if (!resDisenos.ok) throw new Error(dataDisenos.detail || "Error al obtener diseños");

        setDisenos(dataDisenos.disenos);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 flex flex-col gap-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-8 tracking-wide">Menú</h2>
        <button className="bg-white text-blue-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
          Perfil
        </button>
        <button className="bg-white text-blue-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
          Historial
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("session");
            sessionStorage.removeItem("session");
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium transition mt-auto"
        >
          Salir
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Encabezado */}
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">
          Bienvenido, <span className="text-blue-600">{userName || "Cargando..."}</span>
        </h1>

        {/* Cita */}
        <div className="mb-10 bg-white p-5 rounded-xl shadow-md border border-gray-200">
          <p className="font-medium text-gray-700 text-lg">
            Cita agendada para:{" "}
            {cita ? (
              <span className="text-green-600">{cita}</span>
            ) : (
              <span className="text-red-500">No hay citas</span>
            )}
          </p>
        </div>

        {/* Catálogo */}
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Catálogo de Diseños</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {disenos.map((d) => (
            <div
              key={d.id}
              onClick={() => navigate(`/agendamiento/${d.id}`)}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-2xl transition cursor-pointer group"
            >
              <img
                src={d.imagen}
                alt={d.nombre}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5">
                <p className="text-xl font-bold text-gray-800 mb-2">{d.nombre}</p>
                <p className="text-sm text-gray-600">{d.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

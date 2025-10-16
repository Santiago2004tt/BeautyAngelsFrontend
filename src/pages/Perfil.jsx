import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../config";

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionData = localStorage.getItem("session");

    if (!sessionData) {
      setError("No se encontró la sesión del usuario.");
      setLoading(false);
      return;
    }

    const session = JSON.parse(sessionData);
    const id_auth = session?.user?.id;
    const access_token = session?.access_token;

    if (!id_auth) {
      setError("No se encontró el ID del usuario autenticado.");
      setLoading(false);
      return;
    }

    const obtenerDatosUsuario = async () => {
      try {
        const response = await fetch(`${API}/user/obtener_datos_usuario/${id_auth}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`, // por si tu backend lo usa
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUsuario(data.datos_usuario);
        } else {
          setError(data.detail || "Error al obtener los datos del usuario.");
        }
      } catch (err) {
        setError("No se pudo conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    obtenerDatosUsuario();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Cargando datos del usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="relative w-[420px] bg-white border-2 border-black rounded-lg p-6 shadow-md">
        
        {/* Flecha Atrás */}
        <button
          onClick={handleBack}
          className="absolute top-5 left-4 flex items-center group"
        >
          <div className="w-0 h-0 border-t-[7px] border-b-[7px] border-r-[12px] border-transparent border-r-black group-hover:border-r-gray-700"></div>
          <span className="ml-2 text-sm font-medium text-black group-hover:underline">
            Atrás
          </span>
        </button>

        {/* Título */}
        <h2 className="text-center font-semibold text-lg mb-6">
          Información de perfil
        </h2>

        {/* Datos de perfil */}
        <div className="space-y-3 text-sm text-gray-800">
          <p><strong>Nombre de usuario:</strong> {usuario?.nombre || "—"}</p>
          <p><strong>Correo:</strong> {usuario?.correo || "—"}</p>
          <p><strong>Teléfono:</strong> {usuario?.telefono || "—"}</p>
          <p><strong>Creado en:</strong> {usuario?.creado_en || "—"}</p>
        </div>
      </div>
    </div>
  );
}

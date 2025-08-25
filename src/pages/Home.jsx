import { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (token) {
      getProfile(token).then(setProfile);
    }
  }, [token]);

  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow text-center">
        <h1 className="text-2xl font-bold text-green-700">Bienvenido {user?.email}</h1>
        {profile && (
          <div className="mt-4 text-gray-700">
            <p><b>Nombre:</b> {profile.nombre}</p>
            <p><b>Teléfono:</b> {profile.telefono}</p>
            <p><b>Rol:</b> {profile.rol}</p>
          </div>
        )}
        <button onClick={logout} className="mt-6 px-6 py-2 bg-red-500 text-white rounded">Cerrar sesión</button>
      </div>
    </div>
  );
}

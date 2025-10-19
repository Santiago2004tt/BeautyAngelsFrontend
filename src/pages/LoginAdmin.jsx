import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Limpia sesiones previas
  localStorage.clear();
  sessionStorage.clear();

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/auth/login_admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // 👈 aquí el cambio correcto
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(`❌ ${errData.detail || "Credenciales inválidas"}`);
        return;
      }

      const data = await res.json();
      localStorage.setItem("session_admin", JSON.stringify(data.session));
      sessionStorage.setItem("access_token", data.session.access_token);

      navigate("/validacion_admin");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <form
        onSubmit={onSubmit}
        className="relative bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-4"
      >
        {/* Flecha de retorno */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 border-2 border-gray-500 px-2 py-1 rounded-md text-gray-700 font-bold hover:bg-gray-100 transition"
        >
          ←
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Iniciar sesión admin
        </h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        />

        <button
          type="submit"
          className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000"; // tu backend

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  localStorage.clear(); 
  sessionStorage.clear();
  const onSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Credenciales inválidas");
      return;
    }

    const data = await res.json();
    localStorage.setItem("session", JSON.stringify(data.session));
    sessionStorage.setItem("access_token", data.session.access_token);

    navigate("/home"); // redirigir al Home
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Iniciar Sesión
        </h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Entrar
        </button>

        <p className="text-center text-sm text-gray-600 mt-2">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate
          </a>
        </p>
      </form>
    </div>
  );
}

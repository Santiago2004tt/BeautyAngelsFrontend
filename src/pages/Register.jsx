import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    telefono: "",
    rol: "user",
  });

  const [message, setMessage] = useState({ type: "", text: "" }); // Para mostrar mensajes de error o éxito
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API}/auth/register_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error en el registro");
      }

      setMessage({ type: "success", text: data.message || "Usuario registrado exitosamente" });

      // Esperar un momento antes de redirigir
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Hubo un problema en el registro" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Registrarse
        </h2>

        {message.text && (
          <div
            className={`mb-4 text-center p-2 rounded-lg ${
              message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <input
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
          required
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          className="border p-2 w-full mb-5 rounded focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}

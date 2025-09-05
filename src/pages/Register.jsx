import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    telefono: "",
    rol: "user",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://127.0.0.1:8000/auth/register_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Error en el registro");
    }

    alert(data.message); // "Usuario registrado exitosamente"
    navigate("/login");
  } catch (err) {
    alert("Hubo un problema en el registro");
    console.error(err);
  }
};


  return (
  <div className="h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-blue-100">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-lg w-96"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Registrarse</h2>
      <input
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
      />
      <input
        name="telefono"
        placeholder="Teléfono"
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
      />
      <input
        type="email"
        name="email"
        placeholder="Correo"
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        onChange={handleChange}
        className="border p-2 w-full mb-5 rounded focus:ring-2 focus:ring-green-400 outline-none"
      />
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
      >
        Registrarse
      </button>
    </form>
  </div>
);
}

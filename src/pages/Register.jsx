import { useState } from "react";
import { register } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", nombre: "", telefono: "", rol: "user" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form.email, form.password, form.nombre, form.telefono, form.rol);
    alert("Registro exitoso. Verifica tu correo.");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Registrarse</h2>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} className="border p-2 w-full mb-2 rounded"/>
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} className="border p-2 w-full mb-2 rounded"/>
        <input type="email" name="email" placeholder="Correo" onChange={handleChange} className="border p-2 w-full mb-2 rounded"/>
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} className="border p-2 w-full mb-4 rounded"/>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Registrarse</button>
      </form>
    </div>
  );
}

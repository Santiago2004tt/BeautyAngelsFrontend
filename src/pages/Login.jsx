import { useState } from "react";
import { login, getProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(form.email, form.password);
    loginContext(data.user, data.access_token);
    navigate("/home");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow w-96">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        <input type="email" name="email" placeholder="Correo" onChange={handleChange} className="border p-2 w-full mb-2 rounded"/>
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} className="border p-2 w-full mb-4 rounded"/>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Ingresar</button>
      </form>
    </div>
  );
}

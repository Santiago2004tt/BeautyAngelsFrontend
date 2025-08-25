import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-700">Bienvenido a Beauty Angels</h1>
      <div className="mt-6 space-x-4">
        <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow">Iniciar Sesión</Link>
        <Link to="/register" className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow">Registrarse</Link>
      </div>
    </div>
  );
}

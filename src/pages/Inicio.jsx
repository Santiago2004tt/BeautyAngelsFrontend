import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  localStorage.clear();
  sessionStorage.clear();
  return (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
    <div className="bg-white p-10 rounded-2xl shadow-lg text-center w-96">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Beauty Angels</h2>
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate("/login")} 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
        >
          Login Usuario
        </button>
        <button 
          onClick={() => navigate("/login_admin")} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
        >
          Login Admin
        </button>
        <button 
          onClick={() => navigate("/register")} 
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
        >
          Registrar
        </button>
      </div>
    </div>
  </div>
);

}

import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { API } from "../config";

export default function VerificacionCodigo() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [userId, setUserId] = useState(null);
  const [errorCodigo, setErrorCodigo] = useState("");
  const codigoEnviado = useRef(false); // ✅ Evita múltiples envíos

  // =========================
  // 1️⃣ Al montar: generar código solo UNA vez
  // =========================
  useEffect(() => {
    const obtenerCodigo = async () => {
      try {
        if (codigoEnviado.current) return; // Si ya se envió, no volver a ejecutar
        codigoEnviado.current = true; // Marca como enviado

        const session = localStorage.getItem("session_admin");
        if (!session) throw new Error("No se encontró la sesión en localStorage");

        const parsedSession = JSON.parse(session);
        const id = parsedSession?.user?.id;
        if (!id) throw new Error("ID de usuario no válido");

        setUserId(id);

        const res = await fetch(`${API}/user/generar_codigo_verificacion/${id}`, {
          method: "POST",
        });

        if (!res.ok) throw new Error("Error al generar el código de verificación");

        console.log("✅ Código enviado correctamente");
      } catch (error) {
        console.error("Error al generar el código:", error);
      }
    };

    obtenerCodigo();
  }, []);

  // =========================
  // 2️⃣ Verificar código ingresado
  // =========================
  const acceder = async () => {
    try {
      setErrorCodigo("");
      if (!userId) {
        setErrorCodigo("No se pudo identificar al usuario.");
        return;
      }

      const res = await fetch(`${API}/user/verificar_codigo/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigo }),
      });

      if (!res.ok) {
        setErrorCodigo("❌ Código incorrecto. Intenta nuevamente.");
        return;
      }

      const data = await res.json();
      console.log("✅ Código verificado correctamente:", data);

      setErrorCodigo("");
      navigate("/admin_panel");
    } catch (error) {
      console.error("Error al verificar el código:", error);
      setErrorCodigo("❌ Código incorrecto o error de servidor.");
    }
  };

  // =========================
  // 3️⃣ Volver al login
  // =========================
  const handleVolver = () => {
    navigate(-1);
  };

  // =========================
  // 4️⃣ UI
  // =========================
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 px-6">
      {/* Flecha de regreso */}
      <button
        onClick={handleVolver}
        className="absolute top-6 left-6 flex items-center text-gray-600 hover:text-gray-900 transition"
      >
        <span className="text-2xl mr-1">⬅️</span>
        <span className="text-sm font-medium">Volver</span>
      </button>

      {/* Contenedor principal */}
      <div className="bg-gray-50 p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <p className="text-lg mb-6">
          Se envió un código a tu email, revísalo para acceder
        </p>

        <input
          type="text"
          placeholder="Ingresa tu código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-center text-lg tracking-widest"
        />

        {errorCodigo && (
          <p className="text-red-500 text-sm mt-3">{errorCodigo}</p>
        )}

        <button
          className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-xl transition"
          onClick={acceder}
        >
          Acceder
        </button>
      </div>
    </div>
  );
}

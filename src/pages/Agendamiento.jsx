import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Agendamiento() {
  const navigate = useNavigate();
  const { diseno_id } = useParams(); // 👈 id desde la URL
  const [diseno, setDiseno] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(diseno_id);

  useEffect(() => {
    const fetchDiseno = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/diseno/get_diseno/${diseno_id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.detail || "Error al obtener diseño");
        setDiseno(data.diseno);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiseno();
  }, [diseno_id]);

  if (loading) {
    return <p className="p-6 text-gray-600">Cargando diseño...</p>;
  }

  if (!diseno) {
    return <p className="p-6 text-red-500">No se encontró el diseño</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Botón atrás */}
      <button
        onClick={() => navigate("/home")}
        className="flex items-center text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
      >
        ⬅ ATRAS
      </button>

      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* Columna izquierda: Imagen + info */}
        <div className="border rounded-lg p-4">
          <div className="flex justify-center">
            <img
              src={diseno.imagen}
              alt={diseno.nombre}
              className="w-32 h-32 object-cover rounded-full border"
            />
          </div>
          <div className="mt-4 space-y-1 text-sm text-gray-700">
            <p><strong>Nombre:</strong> {diseno.nombre}</p>
            <p><strong>Descripción:</strong> {diseno.descripcion}</p>
            <p><strong>Máx de tintes:</strong> {diseno.max_tintes}</p>
            <p><strong>Precio estimado:</strong> {diseno.precio_estimado}</p>
          </div>
        </div>

        {/* Columna central: fecha/hora/agendar */}
        <div className="flex flex-col space-y-4">
          <input
            type="date"
            className="border rounded-md px-3 py-2 text-sm"
            placeholder="día/mes/año"
          />
          <input
            type="time"
            className="border rounded-md px-3 py-2 text-sm"
            placeholder="Hora"
          />
          <button className="bg-blue-500 text-white rounded-full px-6 py-2 hover:bg-blue-600">
            Agendar
          </button>
        </div>

        {/* Columna derecha: tintes */}
        <div className="space-y-4">
          <div className="border rounded-lg p-4 text-sm">
            <p><strong>Seleccionar tintes</strong></p>
            {/* Aquí iría un select o lista de tintes */}
          </div>

          <div className="border rounded-lg p-4 text-sm">
            <p><strong>Tintes seleccionados:</strong></p>
            <ul className="mt-2 space-y-1">
              <li className="flex justify-between items-center">
                <span>Tinte 1</span>
                <button className="text-red-500">x</button>
              </li>
              <li className="flex justify-between items-center">
                <span>Tinte 2</span>
                <button className="text-red-500">x</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

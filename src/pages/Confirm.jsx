export default function Confirm() {
  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow text-center">
        <h1 className="text-2xl font-bold text-green-600">¡Cuenta confirmada!</h1>
        <p className="mt-4 text-gray-600">Ya puedes cerrar esta ventana.</p>
      </div>
    </div>
  );
}

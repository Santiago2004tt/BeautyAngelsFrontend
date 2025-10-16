import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import Agendamiento from "./pages/Agendamiento";
import Validacion from "./pages/Validacion";
import Perfil from "./pages/Perfil";
import Historial from "./pages/Historial";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agendamiento/:diseno_id" element={<Agendamiento />} />
        <Route path="/validacion" element={<Validacion />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/historial" element={<Historial />} />

      </Routes>
    </BrowserRouter>
  );
}

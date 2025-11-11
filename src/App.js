import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import Agendamiento from "./pages/Agendamiento";
import Validacion from "./pages/Validacion";
import Perfil from "./pages/Perfil";
import Historial from "./pages/Historial";
import LoginAdmin from "./pages/LoginAdmin";
import AdminController from "./pages/AdminController";
import DetalleAgendamientoAdmin from "./pages/DetalleAgendamiento";
import ValidacionAdmin from "./pages/ValidarAdmin";
import Confirmation from "./pages/Confirm";



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
        <Route path="/login_admin" element={<LoginAdmin />} />
        <Route path="/admin_panel" element={<AdminController />} />
        <Route path="/admin/agendamiento/:id" element={<DetalleAgendamientoAdmin />} />
        <Route path="/validacion_admin" element={<ValidacionAdmin />} />
        <Route path="/confirm" element={<Confirmation />} />

      </Routes>
    </BrowserRouter>
  );
}

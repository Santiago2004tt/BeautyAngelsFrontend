import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import Agendamiento from "./pages/Agendamiento";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agendamiento/:diseno_id" element={<Agendamiento />} />
      </Routes>
    </BrowserRouter>
  );
}

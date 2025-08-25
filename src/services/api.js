import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // tu backend FastAPI
});

// Login
export async function login(email, password) {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
}

// Register
export async function register(email, password, nombre, telefono, rol) {
  const res = await API.post("/auth/register", { email, password, nombre, telefono, rol });
  return res.data;
}

// Obtener usuario actual
export async function getProfile(token) {
  const res = await API.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

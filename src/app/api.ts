import axios from "axios";

const envBase = import.meta.env.VITE_MS_API ?? "http://localhost:5267/";
const sanitizedBase = envBase.endsWith("/") ? envBase.slice(0, -1) : envBase;

export const api = axios.create({
  baseURL: `${sanitizedBase}/api/`,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const storage = sessionStorage.getItem("auth-storage");

  if (storage) {
    const { state } = JSON.parse(storage);
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
  }

  return config;
});

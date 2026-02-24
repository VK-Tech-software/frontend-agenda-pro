import axios from "axios";
import { AuthStore } from "@/feature/auth/stores/auth-store";

const rawEnv = import.meta.env.VITE_MS_API;
const sanitizedBase = rawEnv
  ? (rawEnv.endsWith("/") ? rawEnv.slice(0, -1) : rawEnv)
  : "/api";

export const api = axios.create({
  baseURL: `${sanitizedBase}/`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      const { resetAuth } = AuthStore.getState();
      resetAuth();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
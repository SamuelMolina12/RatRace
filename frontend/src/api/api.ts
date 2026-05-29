import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000/api",
});

// ─── JWT Interceptor ────────────────────────────────────────
// Adjunta automáticamente el token en cada request si existe.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("ratrace_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ─── Error Interceptor ────────────────────────────────────────
// Extrae el mensaje de error del backend en caso de fallo.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.data) {
            const data = error.response.data;
            const message = data.error || data.message || "Ocurrió un error en el servidor";
            return Promise.reject(new Error(message));
        }
        return Promise.reject(error);
    }
);
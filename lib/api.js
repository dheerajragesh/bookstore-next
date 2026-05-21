import axios from "axios";

const normalizeApiBaseURL = (value) => {
  const fallback = "/api";
  if (!value || typeof value !== "string") return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  // Recommended: use Next.js rewrites by keeping this relative.
  if (trimmed === "/api" || trimmed.startsWith("/api/")) return trimmed;

  // Allow direct backend URLs, but ensure they include the `/api` prefix expected by the backend.
  // Example: `http://localhost:5000` -> `http://localhost:5000/api`
  // Example: `http://localhost:5000/api` -> stays as-is
  try {
    const url = new URL(trimmed);
    if (url.pathname === "/" || url.pathname === "") url.pathname = "/api";
    else if (url.pathname !== "/api" && !url.pathname.startsWith("/api/")) {
      url.pathname = `/api${url.pathname.startsWith("/") ? "" : "/"}${url.pathname}`;
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
};

// Always use Next.js rewrites (`/api/*` + `/uploads/*`) by default.
// If NEXT_PUBLIC_API_URL is set incorrectly (e.g. missing `/api`), requests can 404.
const apiBaseURL = normalizeApiBaseURL(process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: apiBaseURL,
});


// ================= TOKEN =================
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization =
        `Bearer ${token}`;
    }
  }

  return config;
});

export default api;

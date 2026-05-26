const backendOriginForUploads =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  process.env.BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

// Normalize a backend path like `uploads/x.jpg` or `/uploads/x.jpg` into `/uploads/x.jpg`
const normalizeUploadsPath = (p) => {
  const s = String(p).replace(/\\/g, "/").trim();
  if (!s) return "";

  if (s === "uploads") return "/uploads";
  if (s.startsWith("/uploads/")) return s;
  if (s === "/uploads") return s;
  if (s.startsWith("uploads/")) return `/${s}`;
  return s;
};

export const toAssetPath = (path) => {
  if (!path) return "";

  const normalized = String(path).replace(/\\/g, "/");

  // Already an absolute URL
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  // Support protocol-relative URLs
  if (normalized.startsWith("//")) return normalized;

  const uploadsPath = normalizeUploadsPath(normalized);

  // If it's a backend uploads path, prefer absolute backend URL when available
  if (uploadsPath.startsWith("/uploads/") || uploadsPath === "/uploads") {
    if (backendOriginForUploads) {
      const origin = String(backendOriginForUploads).replace(/\/$/, "");
      return `${origin}${uploadsPath}`;
    }
    // Fallback to relative `/uploads/...` (requires Next rewrites or backend to be served)
    return uploadsPath;
  }

  // Generic normalization
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

export const getErrorMessage = (err, fallback = "Something went wrong") => {
  const message =
    err?.response?.data?.message || err?.message || fallback;

  // Axios: when backend is offline / connection refused
  const lowMsg = String(message).toLowerCase();
  if (
    lowMsg.includes("econnrefused") ||
    lowMsg.includes("connection refused") ||
    lowMsg.includes("network error")
  ) {
    return "Server is not running right now. Please try again later.";
  }

  return message;
};

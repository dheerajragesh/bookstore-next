const backendOriginForUploads =
  process.env.NEXT_PUBLIC_BACKEND_ORIGIN ||
  process.env.BACKEND_ORIGIN ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

export const toAssetPath = (path) => {
  if (!path) return "";

  const normalized = String(path).replace(/\\/g, "/");

  // If full URL already provided, keep it.
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  // If backend returns a relative /uploads/... path, convert it to absolute URL.
  if (normalized.startsWith("/uploads/") || normalized === "/uploads") {
    if (backendOriginForUploads) {
      const origin = String(backendOriginForUploads).replace(/\/$/, "");
      return `${origin}${normalized}`;
    }
    // Fallback: keep relative (will rely on host-level rewrites)
    return normalized;
  }

  // Protocol-relative
  if (normalized.startsWith("//")) return normalized;

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

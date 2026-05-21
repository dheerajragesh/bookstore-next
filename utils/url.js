export const toAssetPath = (path) => {
  if (!path) return "";

  const normalized = String(path).replace(/\\/g, "/");

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://")
  ) {
    try {
      const url = new URL(normalized);

      if (url.pathname === "/uploads" || url.pathname.startsWith("/uploads/")) {
        return `${url.pathname}${url.search}${url.hash}`;
      }

      return normalized;
    } catch {
      return normalized;
    }
  }

  if (normalized.startsWith("//")) {
    return normalized;
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
};

export const getErrorMessage = (err, fallback = "Something went wrong") => {
  return (
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
};

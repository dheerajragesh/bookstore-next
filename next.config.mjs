/** @type {import('next').NextConfig} */
const normalizeBackendOrigin = (value) => {
  const fallback = "http://localhost:5000";
  if (!value || typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;

  try {
    const url = new URL(trimmed);
    // Users sometimes set BACKEND_ORIGIN to include `/api`. Rewrites add it again,
    // so strip it here to prevent `/api/api/*` 404s.
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      url.pathname = "/";
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return fallback;
  }
};

const backendOrigin = normalizeBackendOrigin(process.env.BACKEND_ORIGIN);

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */

const normalizeBackendOrigin = (value) => {
  if (!value) {
    throw new Error("BACKEND_ORIGIN is missing in .env");
  }

  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);

    // Prevent /api/api issue
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      url.pathname = "/";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    throw new Error("Invalid BACKEND_ORIGIN URL");
  }
};

const backendOrigin = normalizeBackendOrigin(
  process.env.BACKEND_ORIGIN
);

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
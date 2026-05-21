"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({
  children,
  sellerOnly = false,
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const token = localStorage.getItem("token");

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      // ================= NOT LOGGED IN =================
      if (!token) {
        router.push("/login");
        return;
      }

      // ================= SELLER ONLY =================
      if (sellerOnly && user?.role !== "seller") {
        router.push("/");
        return;
      }

      // Ensure this state update is not synchronous in the effect body.
      await Promise.resolve();

      if (!cancelled) setLoading(false);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [router, sellerOnly]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">

          <div
            className="spinner-border text-dark"
            role="status"
          ></div>

          <p className="mt-3 fw-semibold">
            Checking authentication...
          </p>

        </div>
      </div>
    );
  }

  return children;
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const user = useMemo(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const role = user?.role || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Avoid setting state synchronously inside effect (ESLint rule).
    // We can treat "loading" as purely based on initial mount.
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div className="spinner-border text-dark" role="status"></div>
          <p className="mt-3 fw-semibold">Loading profile...</p>
        </div>
      </div>
    );
  }

  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div
              className="p-4"
              style={{
                background:
                  "linear-gradient(to right, #111827, #1f2937)",
              }}
            >
              <div className="d-flex align-items-center justify-content-between gap-3">
                <div>
                  <h1 className="text-white fw-bold fs-3 mb-1">
                    {fullName || user?.email || "My Account"}
                  </h1>
                  <div className="text-white-50">
                    {user?.email || "—"}
                  </div>
                </div>

                <span
                  className="badge text-bg-warning px-3 py-2"
                  style={{ fontSize: 13 }}
                >
                  {role ? role.toUpperCase() : "USER"}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h2 className="h5 fw-bold mb-3">Account Summary</h2>

              <div className="list-group list-group-flush">
                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted">Member</span>
                    <span className="fw-semibold">{role ? role : "user"}</span>
                  </div>
                </div>

                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted">Email</span>
                    <span className="fw-semibold">{user?.email || "—"}</span>
                  </div>
                </div>

                <div className="list-group-item border-0 px-0">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-muted">Name</span>
                    <span className="fw-semibold">
                      {fullName || "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-outline-dark rounded-pill"
                  onClick={() => router.push("/books")}
                >
                  Continue Shopping
                </button>
                {role === "user" && (
                  <Link
                    href="/orders"
                    className="btn btn-dark rounded-pill"
                  >
                    View Orders
                  </Link>
                )}
                {role === "seller" && (
                  <Link
                    href="/seller/orders"
                    className="btn btn-dark rounded-pill"
                  >
                    Seller Orders
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold mb-2">Profile</h2>
              <p className="text-muted mb-4">
                Manage your preferences and quickly access your account.
              </p>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="p-3 border rounded-4 h-100">
                    <div className="fw-bold">Customer Wishlist</div>
                    <div className="text-muted small mt-1">
                      Save your favorite books for later.
                    </div>
                    <div className="mt-3">
                      <Link
                        href={role === "user" ? "/wishlist" : "/books"}
                        className="btn btn-warning rounded-pill fw-semibold"
                      >
                        {role === "user" ? "Go to Wishlist" : "Browse Books"}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-3 border rounded-4 h-100">
                    <div className="fw-bold">Shopping Cart</div>
                    <div className="text-muted small mt-1">
                      Review items before checkout.
                    </div>
                    <div className="mt-3">
                      <Link
                        href={role === "user" ? "/cart" : "/books"}
                        className="btn btn-dark rounded-pill fw-semibold"
                      >
                        {role === "user" ? "Go to Cart" : "Browse Books"}
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-3 border rounded-4 h-100">
                    <div className="fw-bold">Security</div>
                    <div className="text-muted small mt-1">
                      Update your access and password settings.
                    </div>
                    <div className="mt-3">
                      <button
                        className="btn btn-outline-dark rounded-pill fw-semibold"
                        onClick={() => router.push("/forgotpassword")}
                      >
                        Reset Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="p-3 border rounded-4 h-100">
                    <div className="fw-bold">Account Actions</div>
                    <div className="text-muted small mt-1">
                      Add more account tools later.
                    </div>
                    <div className="mt-3">
                      <button
                        className="btn btn-outline-warning rounded-pill fw-semibold"
                        onClick={() => router.push("/books")}
                      >
                        Explore Catalog
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 alert alert-light border rounded-4">
                <div className="fw-semibold">Note</div>
                <div className="text-muted">
                  Profile editing is not implemented yet. This page uses the
                  current user data stored at login/signup.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


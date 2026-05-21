"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getErrorMessage } from "@/utils/url";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1); // 1 = verify email, 2 = reset password

  const [emailForm, setEmailForm] = useState({
    email: "",
  });

  const [resetForm, setResetForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (!emailForm.email?.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);
      // Backend expects: POST /api/auth/forgot-password
      // Full path: /api/auth/forgot-password (since backend mounts authRoutes at /api/auth)
      await api.post("/auth/forgot-password", emailForm);

      toast.success("Email verified. You can reset your password now.");

      setResetForm((prev) => ({ ...prev, email: emailForm.email }));
      setStep(2);
    } catch (err) {
      toast.error(getErrorMessage(err, "Email verification failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (resetForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (resetForm.password !== resetForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      // Backend expects: POST /api/auth/reset-password
      await api.post("/auth/reset-password", {
        email: resetForm.email,
        password: resetForm.password,
      });

      toast.success("Password updated successfully");
      router.push("/login");
    } catch (err) {
      toast.error(getErrorMessage(err, "Password reset failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ background: "linear-gradient(to right, #0f172a, #1e293b)" }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 col-sm-10 col-11">
            <div className="card shadow border-0 rounded-4 p-4 p-sm-5">
              <h2 className="fw-bold mb-4 text-center">Forgot Password</h2>

              {step === 1 && (
                <form onSubmit={handleVerifyEmail}>
                  <input
                    type="email"
                    className="form-control form-control-lg mb-3 rounded-4"
                    placeholder="Enter your email"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({ email: e.target.value })}
                    required
                  />

                  <button
                    className="btn btn-dark btn-lg w-100 rounded-4 fw-bold py-3"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>

                  <p className="text-center mt-3 mb-0">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none p-0"
                      onClick={() => router.push("/login")}
                      disabled={loading}
                    >
                      Back to Login
                    </button>
                  </p>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleResetPassword}>
                  <input
                    type="email"
                    className="form-control form-control-lg mb-3 rounded-4"
                    placeholder="Email"
                    value={resetForm.email}
                    readOnly
                  />

                  <input
                    type="password"
                    className="form-control form-control-lg mb-3 rounded-4"
                    placeholder="New password"
                    value={resetForm.password}
                    onChange={(e) =>
                      setResetForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />

                  <input
                    type="password"
                    className="form-control form-control-lg mb-4 rounded-4"
                    placeholder="Confirm password"
                    value={resetForm.confirmPassword}
                    onChange={(e) =>
                      setResetForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                  />

                  <button
                    className="btn btn-dark btn-lg w-100 rounded-4 fw-bold py-3"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>

                  <p className="text-center mt-3 mb-0">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none p-0"
                      onClick={() => setStep(1)}
                      disabled={loading}
                    >
                      Change email
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


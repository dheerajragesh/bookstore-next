"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getErrorMessage } from "@/utils/url";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.data));

      toast.success("Login successful");

      router.push("/books");
    } catch (err) {
      toast.error(getErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: "linear-gradient(to right, #0f172a, #1e293b)" }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 col-sm-10 col-11">
            <div className="card shadow border-0 rounded-4 p-4 p-sm-5">
              <h2 className="fw-bold mb-4 text-center">Login</h2>

              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="form-control form-control-lg mb-3 rounded-4"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />

                <input
                  type="password"
                  className="form-control form-control-lg mb-4 rounded-4"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />

                <button className="btn btn-dark btn-lg w-100 rounded-4 fw-bold py-3" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-link text-decoration-none p-0"
                    onClick={() => router.push("/forgotpassword")}
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

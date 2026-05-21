"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { getErrorMessage } from "@/utils/url";

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", formData);

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        res.data.accessToken
      );

      // SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.data)
      );

      toast.success("Account created successfully 🎉");

      router.push("/books");
    } catch (err) {
      console.log(err);

      toast.error(getErrorMessage(err, "Signup failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background:
          "linear-gradient(to right, #0f172a, #1e293b)",
      }}
    >
      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-lg-5 col-md-8 col-sm-10 col-11">

            <div
              className="card border-0 shadow-lg rounded-5 overflow-hidden"
              style={{
                backdropFilter: "blur(10px)",
              }}
            >
              {/* TOP SECTION */}
              <div
                className="text-white text-center p-5"
                style={{
                  background:
                    "linear-gradient(to right, #111827, #1f2937)",
                }}
              >
                <h1 className="fw-bold mb-3">
                  📚 BookStore
                </h1>

                <p className="mb-0 text-light">
                  Create your account and start shopping
                </p>
              </div>

              {/* FORM */}
              <div className="p-5 bg-white">

                <h2 className="fw-bold mb-4 text-center">
                  Create Account
                </h2>

                <form onSubmit={handleSubmit}>

                  {/* FIRST + LAST NAME */}
                  <div className="row">

                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        First Name
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-lg rounded-4"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-semibold">
                        Last Name
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-lg rounded-4"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        required
                      />
                    </div>

                  </div>

                  {/* EMAIL */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control form-control-lg rounded-4"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      required
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control form-control-lg rounded-4"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  {/* ROLE */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Register As
                    </label>

                    <select
                      className="form-select form-select-lg rounded-4"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="seller">
                        Seller
                      </option>
                    </select>
                  </div>

                  {/* BUTTON */}
                  <button
                    type="submit"
                    className="btn btn-dark btn-lg w-100 rounded-4 py-3 fw-bold"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create Account"}
                  </button>

                </form>

                {/* LOGIN */}
                <div className="text-center mt-4">

                  <p className="text-muted mb-0">
                    Already have an account?
                  </p>

                  <Link
                    href="/login"
                    className="fw-bold text-dark text-decoration-none"
                  >
                    Login Here
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

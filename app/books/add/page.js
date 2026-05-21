"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getErrorMessage } from "@/utils/url";
import { isAdmin, isSeller } from "@/utils/auth";

export default function AddBook() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    excerpt: "",
    page_count: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    // Compute access once; if not allowed, redirect.
    const hasAccess = isAdmin() || isSeller();

    if (!hasAccess) {

      toast.error("You don't have permission to add books");
      router.push("/books");
      return;
    }

    // Avoid setState-in-effect by setting state via microtask.
    queueMicrotask(() => {
      setAuthorized(true);
      setMounted(true);
    });



  }, [router]);




  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("image", image);

      await api.post("/books", formData);

      toast.success("Book added successfully");

      router.push("/books");

    } catch (error) {
      console.log(error);

      toast.error(getErrorMessage(error, "Failed to add book"));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !authorized) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-lg-8">

          <div className="card border-0 shadow-lg rounded-4 p-5">

            <h2 className="fw-bold mb-4">
              ➕ Add New Book
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">
                  Title
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  className="form-control"
                  rows="5"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Price
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Pages
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="page_count"
                    value={form.page_count}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="mb-3">
                <label className="form-label">
                  Excerpt
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Book Image
                </label>

                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    setImage(e.target.files[0])
                  }
                  required
                />
              </div>

              <button
                className="btn btn-dark w-100 py-3 rounded-pill"
                disabled={loading}
              >
                {loading
                  ? "Adding..."
                  : "Add Book"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

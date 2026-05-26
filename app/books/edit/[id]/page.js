"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { getErrorMessage } from "@/utils/url";
import { isAdmin, isSeller } from "@/utils/auth";

export default function EditBook() {
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Proper initial state
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    excerpt: "",
    page_count: "",
  });

  const bookId = params?.id;

  // ======================================
  // ✅ AUTH CHECK
  // ======================================
  useEffect(() => {
    const hasAccess = isAdmin() || isSeller();

    if (!hasAccess) {
      toast.error(
        "You don't have permission to edit books"
      );

      router.push("/books");
      return;
    }

    queueMicrotask(() => {
      setAuthorized(true);
      setMounted(true);
    });
  }, [router]);

  // ======================================
  // ✅ FETCH BOOK
  // ======================================
  useEffect(() => {
    if (!bookId || !authorized) return;

    let cancelled = false;

    const run = async () => {
      try {
        const res = await api.get(
          `/books/${bookId}`
        );

        if (cancelled) return;

        const data = res.data.data;

        // ✅ SAFE STATE UPDATE
        setForm({
          title: data.title ?? "",
          description:
            data.description ?? "",
          price: data.price ?? "",
          excerpt: data.excerpt ?? "",
          page_count:
            data.page_count ?? "",
        });
      } catch (error) {
        console.log(error);

        if (!cancelled) {
          toast.error(
            getErrorMessage(
              error,
              "Failed to fetch book"
            )
          );
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [bookId, authorized]);

  // ======================================
  // ✅ HANDLE CHANGE
  // ======================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================
  // ✅ UPDATE BOOK
  // ======================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        toast.error(
          "Please login first"
        );

        setLoading(false);
        return;
      }

      await api.put(
        `/books/${params.id}`,
        form
      );

      toast.success(
        "Book updated successfully"
      );

      router.push("/books");
    } catch (error) {
      console.log(error);

      toast.error(
        getErrorMessage(
          error,
          "Update failed"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // ✅ LOADER
  // ======================================
  if (!mounted || !authorized) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  // ======================================
  // ✅ UI
  // ======================================
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 p-5">
            <h2 className="fw-bold mb-4">
              ✏️ Edit Book
            </h2>

            <form onSubmit={handleUpdate}>
              {/* TITLE */}
              <div className="mb-3">
                <label className="form-label">
                  Title
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={form.title ?? ""}
                  onChange={handleChange}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mb-3">
                <label className="form-label">
                  Description
                </label>

                <textarea
                  rows="5"
                  className="form-control"
                  name="description"
                  value={
                    form.description ?? ""
                  }
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="row">
                {/* PRICE */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Price
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={form.price ?? ""}
                    onChange={handleChange}
                  />
                </div>

                {/* PAGE COUNT */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Pages
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="page_count"
                    value={
                      form.page_count ?? ""
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* EXCERPT */}
              <div className="mb-4">
                <label className="form-label">
                  Excerpt
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="excerpt"
                  value={form.excerpt ?? ""}
                  onChange={handleChange}
                />
              </div>

              {/* BUTTON */}
              <button
                className="btn btn-dark w-100 py-3 rounded-pill"
                disabled={loading}
              >
                {loading
                  ? "Updating..."
                  : "Update Book"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
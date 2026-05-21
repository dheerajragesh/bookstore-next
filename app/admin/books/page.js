"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { isAdmin } from "@/utils/auth";
import AdminSidebar from "@/components/Adminsidebar";
import { toast } from "react-toastify";

export default function AdminBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const totalPages = Math.max(1, Math.ceil(books.length / pageSize));

  const pagedBooks = useMemo(() => {
    return books.slice((page - 1) * pageSize, page * pageSize);
  }, [books, page]);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Admin access only");
      router.push("/login");
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        const res = await api.get("/books");
        setBooks(res.data?.data || []);
      } catch {
        toast.error("Failed to load books.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [router]);

  const handleDelete = async (id) => {
    try {
      if (!confirm("Delete this book?")) return;

      try {
        await api.delete(`/admin/books/${id}`);
      } catch {
        await api.delete(`/books/${id}`);
      }

      setBooks((prev) => {
        const next = prev.filter((b) => (b._id || b.id) !== id);
        return next;
      });

      // If we delete the last item on the current page, move back.
      setPage((p) => Math.max(1, p - 1));
      toast.success("Book deleted");
    } catch {
      toast.error("Failed to delete book (endpoint may differ). ");
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-3">
          <AdminSidebar />
        </div>

        <div className="col-lg-8 mx-auto">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <h1 className="fw-bold">Books</h1>
            <Link href="/books/add" className="btn btn-dark">
              Add Book
            </Link>
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            {loading ? (
              <div className="p-5 text-center">
                <div className="spinner-border text-dark" />
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: "55%" }}>Title</th>
                        <th style={{ width: "15%" }}>Price</th>
                        <th style={{ width: 230 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center text-muted py-4">
                            No books found.
                          </td>
                        </tr>
                      ) : (
                        pagedBooks.map((b) => (
                          <tr key={b._id || b.id}>
                            <td className="text-truncate" style={{ maxWidth: 520 }}>
                              {b.title || "—"}
                            </td>
                            <td>
                              <span className="badge text-bg-primary">
                                {b.price ?? "—"}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Link
                                  href={`/books/edit/${b._id || b.id}`}
                                  className="btn btn-outline-dark btn-sm"
                                >
                                  Edit
                                </Link>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(b._id || b.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-3 border-top">
                    <div className="text-muted small">
                      Page <b className="text-dark">{page}</b> of {totalPages}
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


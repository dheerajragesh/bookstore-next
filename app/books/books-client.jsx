"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { getErrorMessage, toAssetPath } from "@/utils/url";
import { getToken } from "@/utils/auth";
import ClientRoleBasedAddButton from "./ClientRoleBasedAddButton";
import ClientRoleBasedBookAction from "./ClientRoleBasedBookAction";

let booksCache = null;

export default function BooksClient({ initialQuery = "" }) {
  const router = useRouter();
  const q = (typeof initialQuery === "string" ? initialQuery : "").trim();

  const [books, setBooks] = useState(() => booksCache || []);
  const [loading, setLoading] = useState(() => !booksCache);
  const [search, setSearch] = useState(q);

  useEffect(() => {
    if (booksCache) return;

    let cancelled = false;

    const run = async () => {
      try {
        const res = await api.get("/books");

        if (cancelled) return;
        const nextBooks = res.data.data || [];
        booksCache = nextBooks;
        setBooks(nextBooks);
      } catch (error) {
        console.log(error);
        if (!cancelled) toast.error(getErrorMessage(error, "Failed to load books"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBooks = useMemo(() => {
    if (!q) return books;
    const needle = q.toLowerCase();
    return books.filter((book) => {
      const hay = `${book?.title || ""} ${book?.author || ""} ${book?.category || ""} ${book?.description || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [books, q]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextQ = search.trim();
    if (!nextQ) return router.push("/books");
    router.push(`/books?q=${encodeURIComponent(nextQ)}`);
  };

  const handleSuggestionClick = (book) => {
    if (!book?._id) return;
    if (!getToken()) {
      router.push(`/signup?next=${encodeURIComponent(`/books/${book._id}`)}`);
      return;
    }
    router.push(`/books/${book._id}`);
  };

  const handleClear = () => {
    setSearch("");
    router.push("/books");
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 className="fw-bold display-6 mb-1">Shop Books</h1>
          <p className="text-muted mb-0">
            Browse, compare, and add favorites to your cart
          </p>
        </div>

        {/* ADMIN/SELLER ONLY - ADD BOOK */}
        <ClientRoleBasedAddButton />
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-5">
        <form
          onSubmit={handleSearchSubmit}
          className="d-flex gap-2 flex-wrap align-items-center"
        >
          <input
            className="form-control"
            placeholder="Search by title, author, genre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search books"
            style={{ flex: "1 1 320px" }}
          />

          <button className="btn btn-dark" type="submit">
            Search
          </button>

          <button
            className="btn btn-outline-dark"
            type="button"
            onClick={handleClear}
            disabled={!q && !search}
          >
            Clear
          </button>

          <div className="text-muted small" style={{ marginLeft: "auto" }}>
            {loading ? "Loading..." : `${filteredBooks.length} result(s)`}
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-dark"></div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <h3 className="fw-bold mb-2">No books found</h3>
          <p className="text-muted mb-4">
            Try a different search, or browse all books.
          </p>
          <Link href="/books" className="btn btn-dark rounded-pill px-5 py-3">
            Browse all
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {filteredBooks.map((book) => (
            <div className="col-md-6 col-lg-4 col-xl-3" key={book._id}>
              <div className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden">
                <div
                  className="position-relative"
                  style={{
                    width: "100%",
                    height: "320px",
                    background: "#f1f5f9",
                  }}
                >
                  <Link
                    href={`/books/${book._id}`}
                    className="stretched-link"
                  />
                  <Image
                    src={toAssetPath(book.image)}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-fit-cover"
                  />
                </div>

                <div className="card-body d-flex flex-column">
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none fw-bold"
                    onClick={() => handleSuggestionClick(book)}
                  >
                    {book.title}
                  </button>
                  <div className="text-muted small mb-2">
                    {book.author ? `by ${book.author}` : "—"}
                  </div>

                  <div className="text-muted small mb-3">
                    {book.description?.slice(0, 84)}...
                  </div>

                  <div className="mt-auto">
                    <div className="fw-bold text-success mb-3">
                      {"\u20B9"}
                      {book.price}
                    </div>

                    <div className="d-grid gap-2">
                      <Link
                        href={`/books/${book._id}`}
                        className="btn btn-dark rounded-pill"
                        onClick={(e) => {
                          if (getToken()) return;
                          e.preventDefault();
                          router.push(`/signup?next=${encodeURIComponent(`/books/${book._id}`)}`);
                        }}
                      >
                        View details
                      </Link>

                      {/* USER vs ADMIN/SELLER */}
                      <ClientRoleBasedBookAction bookId={book._id} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


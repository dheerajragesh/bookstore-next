"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextQuery = query.trim();
    if (!nextQuery) return router.push("/books");
    router.push(`/books?q=${encodeURIComponent(nextQuery)}`);
  };

  // ================= HERO SEARCH AUTOCOMPLETE =================
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    // Prevent home-page autocomplete from hammering the backend on initial load.
    // Only fetch when:
    // - user has typed at least 2 characters
    // - dropdown is open (implies user intent / focus)
    // - user is actually interacting (prevents background re-renders)
    if (trimmed.length < 2 || !showDropdown) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        setIsSearching(true);

        const res = await fetch(
          `/api/books?search=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );

        if (!res.ok) return;

        const data = await res.json();
        const books = data?.data || data?.books || data?.result || [];

        setSearchResults(Array.isArray(books) ? books : []);
      } catch (err) {
        if (err?.name !== "AbortError") console.log(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query, showDropdown]);

  const handleSelectBook = (book) => {
    setShowDropdown(false);
    setSearchResults([]);
    setQuery("");
    router.push(`/books/${book?._id}`);
  };


  return (
    <section
      className="bg-dark text-white position-relative overflow-hidden"
      style={{
        minHeight: "86vh",
        background:
          "radial-gradient(1200px 600px at 20% 10%, rgba(245, 158, 11, 0.22), transparent 55%), radial-gradient(900px 500px at 90% 30%, rgba(13, 110, 253, 0.22), transparent 50%), linear-gradient(180deg, #0b1220 0%, #0b1220 60%, #0f172a 100%)",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          pointerEvents: "none",
          opacity: 0.12,
          backgroundImage:
            "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)",
        }}
      />

      <div className="container h-100">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 py-3 py-lg-5">
            <span className="badge bg-warning text-dark px-3 py-2 mb-3 mb-lg-4">
              New arrivals every week
            </span>

            <h1
              className="display-4 display-lg-3 fw-bold mb-3 mb-lg-4"
              style={{ lineHeight: "1.12" }}
            >
              Shop books you&apos;ll actually finish
            </h1>

            <p className="fs-6 fs-lg-5 text-light mb-3 mb-lg-4" style={{ maxWidth: 560 }}>
              A modern e-commerce experience for book lovers—discover trending
              titles, build your wishlist, and checkout in minutes.
            </p>

            <form
              onSubmit={handleSearchSubmit}
              className="d-flex gap-2 flex-column flex-lg-row flex-wrap"
              style={{ maxWidth: 620 }}
            >
              <div className="position-relative" style={{ flex: "1 1 100%" }}>
                <input
                  className="form-control form-control-lg"
                  placeholder="Search by title, author, genre..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => {
                    if (query.trim()) setShowDropdown(true);
                  }}
                  aria-label="Search books"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.20)",
                    color: "rgba(255,255,255,0.92)",
                  }}
                />

                {showDropdown && (
                  <div
                    className="bg-white border rounded-3 shadow-sm mt-2 overflow-hidden"
                    style={{ position: "absolute", left: 0, right: 0, zIndex: 50 }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {isSearching ? (
                      <div className="p-3 text-muted">Searching...</div>
                    ) : searchResults.length ? (
                      <ul className="list-unstyled m-0">
                        {searchResults.slice(0, 8).map((b) => (
                          <li key={b._id}>
                            <button
                              type="button"
                              className="w-100 text-start px-3 py-2 border-0 bg-transparent"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleSelectBook(b)}
                            >
                              <div className="fw-semibold">{b.title}</div>
                              {b.author ? (
                                <div className="text-muted small">{b.author}</div>
                              ) : null}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-3 text-muted">No matches</div>
                    )}
                  </div>
                )}
              </div>

              <button
                className="btn btn-warning btn-lg fw-semibold"
                style={{ minWidth: "120px" }}
              >
                Search
              </button>

              <Link
                href="/books"
                className="btn btn-outline-light btn-lg"
                style={{ minWidth: '120px' }}
              >
                Browse all
              </Link>
            </form>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <Link
                href="/books?q=fiction"
                className="btn btn-outline-light btn-sm"
              >
                Fiction
              </Link>
              <Link
                href="/books?q=self%20help"
                className="btn btn-outline-light btn-sm"
              >
                Self-help
              </Link>
              <Link
                href="/books?q=business"
                className="btn btn-outline-light btn-sm"
              >
                Business
              </Link>
              <Link
                href="/books?q=kids"
                className="btn btn-outline-light btn-sm"
              >
                Kids
              </Link>
            </div>

            <div className="row mt-4 mt-lg-5 g-3 g-lg-4">
              <div className="col-6 col-lg-4">
                <div className="fw-bold text-warning fs-6 fs-lg-5">Fast delivery</div>
                <div className="text-light opacity-75 small">
                  Local shipping
                </div>
              </div>
              <div className="col-6 col-lg-4">
                <div className="fw-bold text-warning fs-6 fs-lg-5">Secure checkout</div>
                <div className="text-light opacity-75 small">
                  Token-based auth
                </div>
              </div>
              <div className="col-6 col-lg-4">
                <div className="fw-bold text-warning fs-6 fs-lg-5">Easy returns</div>
                <div className="text-light opacity-75 small">7-day window</div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 text-center py-3 py-lg-5">
            <div
              className="position-relative"
              style={{
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=60"
                alt="Book collection"
                className="img-fluid rounded-5 shadow-lg"
                style={{
                  height: "min(560px, 70vh)",
                  width: "100%",
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              />

              <div
                className="card border-0 shadow-lg rounded-4 p-3 p-lg-4 position-absolute"
                style={{
                  left: 18,
                  right: 18,
                  bottom: -24,
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div className="text-start flex-grow-1">
                    <div className="fw-bold text-dark fs-6">Bestsellers</div>
                    <div className="text-muted small">
                      Hand-picked weekly picks
                    </div>
                  </div>

                  <Link href="/books" className="btn btn-dark btn-sm" style={{ whiteSpace: 'nowrap' }}>
                    Shop now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


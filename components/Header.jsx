"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { usePathname, useRouter } from "next/navigation";

import ThemeToggle from "@/app/theme/ThemeToggle";

import {
  getUser,
  getRole,
  isAdmin,
  isSeller,
  isUser,
  logoutUser,
} from "@/utils/auth";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // ================= AUTH SYNC =================
  useEffect(() => {
    const syncAuth = () => {
      setUser(getUser());
      setRole(getRole());
      setMounted(true);
    };

    syncAuth();

    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
    };
  }, [pathname]);

  // ================= CLOSE MENU ON ROUTE CHANGE =================
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // ================= LOGOUT =================
  const handleLogout = () => {
    dispatch(logout());

    logoutUser();

    // update navbar instantly
    window.dispatchEvent(new Event("storage"));

    setUser(null);
    setRole(null);

    router.push("/login");
  };

  // ================= SEARCH =================
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const nextQuery = query.trim();

    if (!nextQuery) {
      router.push("/books");
      return;
    }

    router.push(`/books?q=${encodeURIComponent(nextQuery)}`);
  };

  // ================= SEARCH AUTOCOMPLETE =================
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const controller = new AbortController();

    const t = setTimeout(async () => {
      try {
        setIsSearching(true);

        const res = await fetch(
          `/api/books?search=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal }
        );

        if (!res.ok) return;

        const data = await res.json();

        const books = data?.data || data?.books || data?.result || [];

        setSearchResults(Array.isArray(books) ? books : []);
        setShowDropdown(true);
      } catch (err) {
        if (err?.name !== "AbortError") {
          console.log(err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  // ================= SELECT BOOK =================
  const handleSelectBook = (book) => {
    setShowDropdown(false);
    setSearchResults([]);
    setQuery("");

    router.push(`/books/${book?._id}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* LOGO */}
        <Link
          href="/"
          className="navbar-brand fw-bold fs-3 me-4 d-flex align-items-center gap-2"
        >
          <span
            aria-hidden
            style={{
              width: 34,
              height: 34,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              background: "#ffc107",
              color: "#212529",
              fontWeight: 900,
            }}
          >
            B
          </span>

          <span>BookStore</span>
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAVBAR */}
        <div
          className={`collapse navbar-collapse ${
            menuOpen ? "show" : ""
          }`}
        >
          {/* SEARCH */}
          <form
            onSubmit={handleSearchSubmit}
            className="d-flex align-items-center gap-2 mx-lg-4 my-3 my-lg-0 position-relative"
          >
            <div className="position-relative" style={{ minWidth: 260 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search books..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => {
                  if (query.trim()) {
                    setShowDropdown(true);
                  }
                }}
              />

              {showDropdown && (
                <div
                  className="bg-white border rounded-3 shadow-sm mt-2 overflow-hidden"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    zIndex: 50,
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {isSearching ? (
                    <div className="p-3 text-muted">
                      Searching...
                    </div>
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
                            <div className="fw-semibold">
                              {b.title}
                            </div>

                            {b.author ? (
                              <div className="text-muted small">
                                {b.author}
                              </div>
                            ) : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 text-muted">
                      No matches
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="btn btn-warning" type="submit">
              Search
            </button>
          </form>

          {/* LINKS */}
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            <li className="nav-item">
              <ThemeToggle />
            </li>

            <li className="nav-item">
              <Link href="/books" className="nav-link">
                Books
              </Link>
            </li>

            {/* USER ONLY */}
            {mounted && isUser() && (
              <>
                <li className="nav-item">
                  <Link href="/cart" className="nav-link">
                    Cart
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/wishlist" className="nav-link">
                    Wishlist
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/orders" className="nav-link">
                    My Orders
                  </Link>
                </li>
              </>
            )}

            {/* SELLER ONLY */}
            {mounted && isSeller() && (
              <>
                <li className="nav-item">
                  <Link href="/seller/books" className="nav-link">
                    My Books
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/books/add" className="nav-link">
                    ➕ Add Book
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/seller/orders" className="nav-link">
                    Orders
                  </Link>
                </li>
              </>
            )}

            {/* ADMIN ONLY - ADD BOOK */}
            {mounted && isAdmin() && (
              <li className="nav-item">
                <Link href="/books/add" className="nav-link">
                  ➕ Add Book
                </Link>
              </li>
            )}

            {/* ADMIN ONLY */}
            {mounted && isAdmin() && (
              <li className="nav-item">
                <Link
                  href="/admin"
                  className="btn btn-warning fw-semibold"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}

            {/* LOGIN / LOGOUT */}
            {!user && mounted ? (
              <>
                <li className="nav-item">
                  <Link
                    href="/login"
                    className="btn btn-outline-light"
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/signup"
                    className="btn btn-warning fw-semibold"
                  >
                    Signup
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item d-flex align-items-center gap-2">
                <div className="d-none d-lg-block text-end">
                  <div className="small text-white-50">
                    {user?.email || ""}
                  </div>

                  <div className="small text-warning">
                    {role || ""}
                  </div>
                </div>

                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
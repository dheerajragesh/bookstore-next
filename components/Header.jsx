"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

import ThemeToggle from "@/app/theme/ThemeToggle";

import { logoutUser, notifyAuthChanged } from "@/utils/auth";

const subscribeToAuth = (callback) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("authchange", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("authchange", callback);
  };
};

const getUserJsonSnapshot = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user");
};

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const userJson = useSyncExternalStore(
    subscribeToAuth,
    getUserJsonSnapshot,
    () => null
  );

  const user = useMemo(() => {
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }, [userJson]);

  const role = user?.role || null;
  const isAdminRole = role === "admin";
  const isSellerRole = role === "seller";
  const isUserRole = role === "user";


  // ================= LOGOUT =================
  const handleLogout = () => {
    dispatch(logout());

    logoutUser();
    notifyAuthChanged();
    setMenuOpen(false);
    setQuery("");
    setShowDropdown(false);
    setSearchResults([]);

    router.push("/login");
  };

  // ================= SEARCH =================
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const nextQuery = query.trim();
    setMenuOpen(false);
    setShowDropdown(false);
    setSearchResults([]);

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
  const trimmedQuery = query.trim();
  const shouldShowDropdown = showDropdown && trimmedQuery.length > 0;

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

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
    setMenuOpen(false);

    router.push(`/books/${book?._id}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        {/* LOGO */}
        <Link
          href="/"
          className="navbar-brand fw-bold fs-3 me-4 d-flex align-items-center gap-2"
          onClick={() => setMenuOpen(false)}
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
                  const next = e.target.value;
                  setQuery(next);
                  const nextTrimmed = next.trim();
                  setShowDropdown(Boolean(nextTrimmed));
                  if (!nextTrimmed) setSearchResults([]);
                }}
                onFocus={() => {
                  setShowDropdown(Boolean(query.trim()));
                }}
              />

              {shouldShowDropdown && (
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
            {isUserRole && !isAdminRole && (
              <>
                <li className="nav-item">
                  <Link href="/profile" className="nav-link">
                    My Profile
                  </Link>
                </li>

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
            {isSellerRole && !isAdminRole && (
              <>
                <li className="nav-item">
                  <Link href="/books" className="nav-link">
                    My Books
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/seller/orders" className="nav-link">
                    📦 Orders
                  </Link>
                </li>
              </>
            )}

            {/* ADMIN ONLY: show ONLY Admin Dashboard */}
            {isAdminRole && (
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
            {!user ? (
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

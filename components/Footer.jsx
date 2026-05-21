"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="text-white pt-5 pb-4 mt-5"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e293b 100%)",
      }}
    >
      <div className="container">

        <div className="row gy-5">

          {/* BRAND */}
          <div className="col-lg-4">

            <h2 className="fw-bold mb-3">
              <span className="text-warning">
                📚
              </span>{" "}
              BookStore
            </h2>

            <p
              className="text-light opacity-75"
              style={{
                lineHeight: "1.9",
              }}
            >
              Discover thousands of books from
              bestselling authors with a premium
              online shopping experience.
            </p>

          </div>

          {/* QUICK LINKS */}
          <div className="col-6 col-lg-2">

            <h5 className="fw-bold mb-4">
              Quick Links
            </h5>

            <ul className="list-unstyled d-flex flex-column gap-2">

              <li>
                <Link
                  href="/"
                  className="text-decoration-none text-light opacity-75"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/books"
                  className="text-decoration-none text-light opacity-75"
                >
                  Books
                </Link>
              </li>

              <li>
                <Link
                  href="/cart"
                  className="text-decoration-none text-light opacity-75"
                >
                  Cart
                </Link>
              </li>

              <li>
                <Link
                  href="/wishlist"
                  className="text-decoration-none text-light opacity-75"
                >
                  Wishlist
                </Link>
              </li>

            </ul>

          </div>

          {/* CUSTOMER */}
          <div className="col-6 col-lg-2">

            <h5 className="fw-bold mb-4">
              Customer
            </h5>

            <ul className="list-unstyled d-flex flex-column gap-2">

              <li>
                <Link
                  href="/orders"
                  className="text-decoration-none text-light opacity-75"
                >
                  Orders
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="text-decoration-none text-light opacity-75"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  href="/signup"
                  className="text-decoration-none text-light opacity-75"
                >
                  Signup
                </Link>
              </li>

            </ul>

          </div>

          {/* NEWSLETTER */}
          <div className="col-lg-4">

            <h5 className="fw-bold mb-4">
              Subscribe Newsletter
            </h5>

            <p className="text-light opacity-75">
              Get updates about new arrivals and
              special offers.
            </p>

            <div className="input-group mt-4">

              <input
                type="email"
                className="form-control rounded-start-pill border-0 px-4 py-3"
                placeholder="Enter your email"
              />

              <button className="btn btn-warning rounded-end-pill px-4 fw-bold">
                Subscribe
              </button>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <hr className="border-secondary my-5" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">

          <p className="mb-0 text-light opacity-75">
            © 2026 BookStore. All rights reserved.
          </p>

          <div className="d-flex gap-3">

            <a
              href="#"
              className="text-light text-decoration-none"
            >
              Facebook
            </a>

            <a
              href="#"
              className="text-light text-decoration-none"
            >
              Instagram
            </a>

            <a
              href="#"
              className="text-light text-decoration-none"
            >
              Twitter
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}
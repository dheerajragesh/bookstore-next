"use client";

import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div className="bg-dark text-white p-4 rounded-4">

      <h3 className="fw-bold mb-4">
        Admin Panel
      </h3>

      <div className="d-flex flex-column gap-3">

        <Link
          href="/admin"
          className="btn btn-outline-light"
        >
          Dashboard
        </Link>

        <Link
          href="/admin/users"
          className="btn btn-outline-light"
        >
          Users
        </Link>

        <Link
          href="/admin/books"
          className="btn btn-outline-light"
        >
          Books
        </Link>

      </div>
    </div>
  );
}
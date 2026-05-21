"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRole, isAdmin, isSeller, isUser } from "@/utils/auth";

export default function ClientRoleBasedBookAction({ bookId }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const role = getRole();

  if (isUser() || role === "user") {
    return (
      <Link
        href={`/payment?bookId=${encodeURIComponent(bookId)}`}
        className="btn btn-success rounded-pill"
      >
        🛒 Buy Now
      </Link>
    );
  }

  if (isAdmin() || isSeller() || role === "admin" || role === "seller") {
    return (
      <Link
        href={`/books/edit/${bookId}`}
        className="btn btn-outline-dark rounded-pill"
      >
        Edit book
      </Link>
    );
  }

  return null;
}


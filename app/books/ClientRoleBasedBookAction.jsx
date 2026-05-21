"use client";

import Link from "next/link";
import { getRole, isAdmin, isSeller, isUser } from "@/utils/auth";
import { useIsClient } from "@/utils/useIsClient";

export default function ClientRoleBasedBookAction({ bookId }) {
  const isClient = useIsClient();
  if (!isClient) return null;

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

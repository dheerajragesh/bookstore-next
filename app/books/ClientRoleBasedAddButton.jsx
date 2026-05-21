"use client";

import Link from "next/link";
import { isAdmin, isSeller } from "@/utils/auth";
import { useIsClient } from "@/utils/useIsClient";

export default function ClientRoleBasedAddButton() {
  const isClient = useIsClient();

  // Avoid hydration mismatches by rendering nothing until client mount.
  if (!isClient) return null;

  if (!(isAdmin() || isSeller())) return null;

  return (
    <Link href="/books/add" className="btn btn-dark px-4 py-2 rounded-pill">
      Add Book
    </Link>
  );
}

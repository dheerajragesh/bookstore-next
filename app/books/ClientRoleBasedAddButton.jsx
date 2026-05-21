"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isAdmin, isSeller } from "@/utils/auth";

export default function ClientRoleBasedAddButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatches by rendering nothing until client mount.
  if (!mounted) return null;

  return (isAdmin() || isSeller()) && (
    <Link href="/books/add" className="btn btn-dark px-4 py-2 rounded-pill">
      Add Book
    </Link>
  );
}


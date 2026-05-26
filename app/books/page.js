import { Suspense } from "react";
import BooksClient from "./books-client";

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-5 text-center">Loading...</div>
      }
    >
      <BooksClient />
    </Suspense>
  );
}


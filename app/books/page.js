import BooksClient from "./books-client";

export default function BooksRoute({ searchParams }) {
  const q =
    typeof searchParams?.q === "string" ? searchParams.q : "";

  // Remount on query change to avoid syncing props -> state via useEffect.
  return <BooksClient key={q} initialQuery={q} />;
}


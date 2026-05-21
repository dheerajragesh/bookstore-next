import BooksPage from "./paage";

export default async function BooksRoute({ searchParams }) {
  const params = await searchParams;
  const q = typeof params?.q === "string" ? params.q : "";

  return <BooksPage initialQuery={q} />;
}


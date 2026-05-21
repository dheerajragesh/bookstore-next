"use client";

import Link from "next/link";

const featured = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=60",
    query: "Atomic Habits",
    badge: "Bestseller",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=60",
    query: "Rich Dad Poor Dad",
    badge: "Popular",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=60",
    query: "Deep Work",
    badge: "Editor pick",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 699,
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=60",
    query: "Psychology of Money",
    badge: "Trending",
  },
];

export default function FeaturedBooks() {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold mb-1">Featured this week</h2>
            <p className="text-muted mb-0">
              Quick picks that feel like a great deal
            </p>
          </div>

          <Link href="/books" className="btn btn-dark">
            View all
          </Link>
        </div>

        <div className="row g-4">
          {featured.map((book) => (
            <div className="col-md-6 col-lg-3" key={book.title}>
              <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                <div className="position-relative" style={{ height: 300 }}>
                  <img
                    src={book.image}
                    alt={book.title}
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover" }}
                  />

                  <span
                    className="badge bg-dark text-white position-absolute top-0 start-0 m-3"
                    style={{ border: "1px solid rgba(255,255,255,0.14)" }}
                  >
                    {book.badge}
                  </span>
                </div>

                <div className="card-body d-flex flex-column">
                  <div className="fw-bold">{book.title}</div>
                  <div className="text-muted small mb-3">by {book.author}</div>

                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div className="fw-bold text-success">
                      {"\u20B9"}
                      {book.price}
                    </div>

                    <Link
                      href={`/books?q=${encodeURIComponent(book.query)}`}
                      className="btn btn-outline-dark btn-sm"
                    >
                      Quick view
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


"use client";

import Image from "next/image";
import Link from "next/link";

import { toast } from "react-toastify";

import api from "@/lib/api";

import {
  getErrorMessage,
  toAssetPath,
} from "@/utils/url";

import {
  getUser,
  isAdmin,
  isSeller,
  isUser,
} from "@/utils/auth";

export default function BookCard({ book }) {
  const user = getUser();

  // ================= ADD TO CART =================
  const handleAddToCart = async () => {
    try {
      if (!isUser()) {
        return toast.error(
          "Only users can add to cart"
        );
      }

      await api.post("/cart/add", {
        productId: book._id,
        quantity: 1,
      });

      toast.success("Added to cart 🛒");
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Failed to add to cart")
      );
    }
  };

  // ================= WISHLIST =================
  const handleWishlist = async () => {
    try {
      if (!isUser()) {
        return toast.error(
          "Only users can use wishlist"
        );
      }

      await api.post("/wishlist/add", {
        productId: book._id,
      });

      toast.success("Added to wishlist ❤️");
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Wishlist failed")
      );
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm(
        "Delete this book?"
      );

      if (!confirmDelete) return;

      await api.delete(
        `/books/delete/${book._id}`
      );

      toast.success("Book deleted");

      window.location.reload();
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Delete failed")
      );
    }
  };

  const canManageBook =
    isAdmin() ||
    (isSeller() &&
      user?._id === book.user_id);

  return (
    <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">

      {/* IMAGE */}
      <div
        className="position-relative"
        style={{
          width: "100%",
          height: "320px",
        }}
      >
        <Image
          src={toAssetPath(book.image)}
          alt={book.title}
          fill
          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
          className="object-fit-cover"
        />

        <span className="badge bg-dark position-absolute top-0 start-0 m-3">
          {book.category || "Book"}
        </span>
      </div>

      {/* BODY */}
      <div className="card-body d-flex flex-column">

        <h5 className="fw-bold">
          {book.title}
        </h5>

        <p className="text-muted">
          by {book.author}
        </p>

        <p className="text-secondary small">
          {book.description?.slice(0, 90)}...
        </p>

        <h5 className="text-success fw-bold mb-3">
          ₹{book.price}
        </h5>

        <div className="mt-auto">

          {/* VIEW */}
          <Link
            href={`/books/${book._id}`}
            className="btn btn-dark w-100 mb-2"
          >
            View Details
          </Link>

          {/* USER BUTTONS */}
          {isUser() && (
            <div className="d-flex gap-2 mb-2">

              <button
                className="btn btn-success w-100"
                onClick={handleAddToCart}
              >
                💳 Buy Now
              </button>

              <button
                className="btn btn-outline-danger w-100"
                onClick={handleWishlist}
              >
                ❤️ Wishlist
              </button>

            </div>
          )}

          {/* SELLER/ADMIN */}
          {canManageBook && (
            <div className="d-flex gap-2">

              <Link
                href={`/books/edit/${book._id}`}
                className="btn btn-outline-primary w-100"
              >
                ✏️ Edit
              </Link>

              <button
                className="btn btn-danger w-100"
                onClick={handleDelete}
              >
                🗑️ Delete
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
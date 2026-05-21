"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { getErrorMessage, toAssetPath } from "@/utils/url";
import { isAdmin, isSeller, isUser } from "@/utils/auth";
import { addToWishlist } from "@/redux/slices/wishlistSlice";

export default function SingleBookPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);

  const bookId = params?.id;

  useEffect(() => {
    if (!bookId) return;

    let cancelled = false;

    const run = async () => {
      try {
        const res = await api.get(`/books/${bookId}`);

        if (cancelled) return;

        setBook(res.data.data);
      } catch (error) {
        console.log(error);

        if (!cancelled) {
          toast.error(getErrorMessage(error, "Failed to load book"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login first");

      await api.post("/cart/add", {
        productId: book._id,
        quantity: 1,
      });

      toast.success("Added to cart");
    } catch (error) {
      console.log(error);
      toast.error(getErrorMessage(error, "Failed to add to cart"));
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      setAddingToWishlist(true);
      
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        setAddingToWishlist(false);
        return;
      }

      await dispatch(addToWishlist(book._id)).unwrap();
      toast.success("Added to wishlist");
    } catch (error) {
      console.log(error);
      toast.error(error || "Failed to add to wishlist");
    } finally {
      setAddingToWishlist(false);
    }
  };

  const handleEditBook = () => {
    router.push(`/books/edit/${bookId}`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-5 text-center">
        <h2>Book not found</h2>
      </div>
    );
  }

  const userRole = isUser();
  const isSellerOrAdmin = isSeller() || isAdmin();

  return (
    <div className="container py-5">
      <div className="row g-5">
        {/* IMAGE */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "650px",
              }}
            >
              <Image
                src={toAssetPath(book.image)}
                alt={book.title}
                fill
                sizes="(max-width: 991px) 100vw, 650px"
                className="object-fit-cover"
              />
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="col-lg-7">
          <h1 className="fw-bold display-5">{book.title}</h1>
          <h2 className="text-success fw-bold my-4">₹{book.price}</h2>

          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">Description</h5>
            <p className="text-muted">{book.description}</p>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-3">Book Details</h5>
            <p>
              <strong>Pages:</strong> {book.page_count || "N/A"}
            </p>
            <p>
              <strong>Excerpt:</strong> {book.excerpt || "N/A"}
            </p>
          </div>

          {/* USER ACTIONS */}
          {userRole && (
            <div className="d-flex gap-3 flex-wrap">
              <button
                className="btn btn-dark btn-lg rounded-pill px-5"
                onClick={async () => {
                  await handleAddToCart();
                  router.push("/payment");
                }}
                disabled={addingToCart}
              >
                {addingToCart ? "Adding..." : "🛒 Buy Now"}
              </button>

              <button
                className="btn btn-outline-danger btn-lg rounded-pill px-5"
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
              >
                {addingToWishlist ? "Adding..." : "❤️ Wishlist"}
              </button>
            </div>
          )}

          {/* USER ACTIONS VS SELLER/ADMIN ACTIONS */}
          {isSellerOrAdmin ? (
            <button
              className="btn btn-warning btn-lg rounded-pill px-5"
              onClick={handleEditBook}
            >
              ✏️ Edit Book
            </button>
          ) : (
            <button
              className="btn btn-outline-dark btn-lg rounded-pill px-5"
              onClick={() => router.push("/wishlist")}
            >
              ❤️ Wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchWishlist,
  removeFromWishlist,
  clearError,
} from "@/redux/slices/wishlistSlice";

import { getErrorMessage, toAssetPath } from "@/utils/url";


export default function WishlistPage() {
  const dispatch = useDispatch();

  const { items, wishlistItems, loading, error } = useSelector(
    (state) => state.wishlist
  );

  // Backward/forward compatible with both state shapes:
  // - older: state.wishlist.items
  // - current: state.wishlist.wishlistItems
  const list = items ?? wishlistItems;


  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRemove = async (bookId) => {
    try {
      await dispatch(removeFromWishlist(bookId)).unwrap();
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err || "Failed to remove from wishlist");
    }
  };

  if (loading) {

    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  const userRole = typeof window !== "undefined" ? getRole() : null;

  // Sellers/Admins manage books (edit). Logged-in normal users should instead buy.
  const showAdminSellerEdit = userRole === "admin" || userRole === "seller";


  return (
    <>
      <div className="container py-5">

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 className="fw-bold display-6 mb-1">Wishlist</h1>
            <p className="text-muted mb-0">Saved books for later</p>
          </div>

          <Link href="/books" className="btn btn-outline-dark rounded-pill px-4">
            Browse Books
          </Link>
        </div>

        {list?.length === 0 ? (

          <div className="card p-5 shadow border-0 rounded-4 text-center">
            <h3 className="fw-bold mb-2">Your wishlist is empty</h3>
            <p className="text-muted mb-4">
              Add books you love and come back anytime.
            </p>
            <Link href="/books" className="btn btn-dark rounded-pill px-5 py-3">
              Shop Books
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {list.map((item) => {

              const product =
                item?.productId || item?.book || item?.product || item;

              const bookId =
                item?.productId?._id ||
                item?.productId ||
                item?.book?._id ||
                item?.product?._id ||
                item?._id;

              const title = product?.title || "Untitled";
              const author = product?.author;
              const price = product?.price;
              const image = product?.image;
              const imageSrc = toAssetPath(image);

              return (
                <div className="col-md-6 col-lg-4" key={bookId || title}>
                  <div className="card border-0 shadow-lg rounded-4 overflow-hidden h-100">
                    <div
                      className="position-relative"
                      style={{ width: "100%", height: 320, background: "#f1f5f9" }}
                    >
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={title}
                          fill
                          className="object-fit-cover"
                        />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <div className="fw-bold">{title}</div>
                      <div className="text-muted small mb-3">
                        {author ? `by ${author}` : "—"}
                      </div>

                      <div className="mt-auto d-flex justify-content-between align-items-center gap-2 flex-wrap">
                        <div className="fw-bold text-success">
                          {typeof price === "number" ? `₹${price}` : ""}
                        </div>

                        <div className="d-flex gap-2">
                          {bookId && (
                            <Link
                              href={`/books/${bookId}`}
                              className="btn btn-outline-dark btn-sm"
                            >
                              View
                            </Link>
                          )}

                          <Link
                            href={`/payment?bookId=${encodeURIComponent(
                              bookId
                            )}`}
                            className="btn btn-success btn-sm"
                          >
                            Buy Now
                          </Link>

                          {bookId && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleRemove(bookId)}
                            >
                              Remove
                            </button>
                          )}



                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { getErrorMessage, toAssetPath } from "@/utils/url";
import { isUser } from "@/utils/auth";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/get");

      setCartItems(res.data.data || []);
    } catch (error) {
      console.log(error);

      toast.error(getErrorMessage(error, "Failed to load cart"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const token = localStorage.getItem("token");
        const authed = Boolean(token) && isUser();
        if (!cancelled) setIsAuthenticated(authed);

        if (!authed) {
          if (!cancelled) {
            setCartItems([]);
            setLoading(false);
          }
          return;
        }

        const res = await api.get("/cart/get");

        if (cancelled) return;

        setCartItems(res.data.data || []);
      } catch (error) {
        console.log(error);

        if (!cancelled) {
          toast.error(getErrorMessage(error, "Failed to load cart"));
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
  }, []);

  // ================= UPDATE QUANTITY =================
  const updateQuantity = async (bookId, quantity) => {
    try {
      await api.put(`/cart/update/${bookId}`, { quantity });

      fetchCart();
    } catch (error) {
      console.log(error);

      toast.error(getErrorMessage(error, "Failed to update cart"));
    }
  };

  // ================= REMOVE ITEM =================
  const removeItem = async (bookId) => {
    try {
      await api.delete(`/cart/remove/${bookId}`);

      toast.success("Item removed");

      fetchCart();
    } catch (error) {
      console.log(error);

      toast.error(getErrorMessage(error, "Failed to remove item"));
    }
  };

  // ================= TOTAL =================
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.book.price * item.quantity,
    0,
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isUser()) {
  return (
      <div className="container py-5">
        <div className="card border-0 shadow-lg rounded-4 p-5 text-center">
          <h2 className="fw-bold mb-2">Please log in</h2>
          <p className="text-muted mb-4">
            Log in to view your cart and continue checkout.
          </p>
          <Link href="/login" className="btn btn-dark rounded-pill px-5 py-3">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* TITLE */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold display-6">🛒 Shopping Cart</h1>

          <p className="text-muted">Review your selected books</p>
        </div>

        <Link href="/books" className="btn btn-outline-dark rounded-pill px-4">
          Continue Shopping
        </Link>
      </div>

      {/* EMPTY CART */}
      {cartItems.length === 0 ? (
        <div className="card border-0 shadow-lg rounded-4 p-5 text-center">
          <h2 className="fw-bold mb-3">Your cart is empty</h2>

          <p className="text-muted mb-4">
            Add books to your cart to continue shopping
          </p>

          <Link href="/books" className="btn btn-dark rounded-pill px-5 py-3">
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* CART ITEMS */}
          <div className="col-lg-8 col-12">
            {cartItems.map((item) => (
              <div
                className="card border-0 shadow-lg rounded-4 mb-4 overflow-hidden"
                key={item._id}
              >
                <div className="row g-0">
                  {/* IMAGE */}
                  <div className="col-md-3">
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "250px",
                      }}
                    >
                      <Image
                        src={toAssetPath(item.book.image)}
                        alt={item.book.title}
                        fill
                        className="object-fit-cover"
                      />
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="col-md-9">
                    <div className="card-body h-100 d-flex flex-column">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h4 className="fw-bold">{item.book.title}</h4>

                          <p className="text-muted">
                            {item.book.excerpt || "Premium Book Collection"}
                          </p>
                        </div>

                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill"
                          onClick={() => removeItem(item.book._id)}
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center">
                          {/* QUANTITY */}
                          <div className="d-flex align-items-center gap-3">
                            <button
                              className="btn btn-outline-dark rounded-circle"
                              onClick={() =>
                                updateQuantity(item.book._id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>

                            <span className="fw-bold fs-5">
                              {item.quantity}
                            </span>

                            <button
                              className="btn btn-outline-dark rounded-circle"
                              onClick={() =>
                                updateQuantity(item.book._id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>

                          {/* PRICE */}
                          <div className="text-end">
                            <h4 className="fw-bold text-success mb-0">
                              ₹{item.book.price * item.quantity}
                            </h4>

                            <small className="text-muted">
                              ₹{item.book.price} each
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="col-lg-4 col-12">
            <div className="card border-0 shadow-lg rounded-4 p-4" style={{ position: 'sticky', top: '80px' }}>
              <h3 className="fw-bold mb-4">Order Summary</h3>

              <div className="d-flex justify-content-between mb-3">
                <span>
                  Items (
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                </span>

                <span>₹{totalPrice}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>

                <span className="text-success">Free</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <h4 className="fw-bold">Total</h4>

                <h4 className="fw-bold text-success">₹{totalPrice}</h4>
              </div>

              <Link
                href="/payment"
                className="btn btn-dark w-100 py-3 rounded-pill fw-bold"
              >
                Proceed To Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

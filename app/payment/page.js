"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/lib/api";
import {
  getErrorMessage,
  toAssetPath,
} from "@/utils/url";

export default function PaymentPage() {
  const router = useRouter();

  const [cartItems, setCartItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [address, setAddress] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  // ================= FETCH CART =================
  useEffect(() => {
    let cancelled = false;

    const fetchCart = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const authed = Boolean(token);

        if (!cancelled) {
          setIsAuthenticated(authed);
        }

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
          toast.error(
            getErrorMessage(
              error,
              "Failed to load cart"
            )
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCart();

    return () => {
      cancelled = true;
    };
  }, []);

  // ================= TOTAL =================
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (item.book?.price || 0) *
        item.quantity,
    0
  );

  // ================= PLACE ORDER =================
  const handlePlaceOrder = async () => {
    try {
      if (!address.trim()) {
        return toast.error(
          "Please enter delivery address"
        );
      }

      if (cartItems.length === 0) {
        return toast.error("Cart is empty");
      }

      setPlacingOrder(true);

      const orderItems = cartItems.map((item) => ({
        product: item.book?._id,
        quantity: item.quantity,
      }));
      console.log(
        "ORDER ITEMS:",
        orderItems
      );

      // ✅ PLACE ORDER
      const res = await api.post(
        "/orders/place",
        {
          items: orderItems,
          totalAmount: totalPrice,
          address,
          paymentMethod,
        }
      );

      console.log(
        "ORDER RESPONSE:",
        res.data
      );

      toast.success(
        "Order placed successfully 🎉"
      );

      router.push("/orders");
    } catch (error) {
      console.log(
        "PLACE ORDER ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>
      </div>
    );
  }

  // ================= LOGIN CHECK =================
  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <div className="card border-0 shadow-lg rounded-4 p-5 text-center">
          <h2 className="fw-bold mb-2">
            Please log in
          </h2>

          <p className="text-muted mb-4">
            Log in to checkout and place
            your order.
          </p>

          <button
            className="btn btn-dark rounded-pill px-5 py-3"
            onClick={() =>
              router.push("/login")
            }
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* PAGE TITLE */}
      <div className="mb-5">
        <h1 className="fw-bold display-6">
          💳 Checkout
        </h1>

        <p className="text-muted">
          Complete your order securely
        </p>
      </div>

      <div className="row g-3 g-lg-5">
        {/* LEFT SIDE */}
        <div className="col-lg-8 col-12">
          {/* ADDRESS */}
          <div className="card border-0 shadow-lg rounded-4 p-4 mb-4">
            <h4 className="fw-bold mb-4">
              📍 Delivery Address
            </h4>

            <textarea
              className="form-control"
              rows="5"
              placeholder="Enter your complete address..."
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            ></textarea>
          </div>

          {/* PAYMENT METHOD */}
          <div className="card border-0 shadow-lg rounded-4 p-4">
            <h4 className="fw-bold mb-4">
              💰 Payment Method
            </h4>

            <div className="d-grid gap-3">
              {/* COD */}
              <button
                className={`btn py-3 rounded-4 ${
                  paymentMethod === "COD"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setPaymentMethod("COD")
                }
              >
                Cash On Delivery
              </button>

              {/* UPI */}
              <button
                className={`btn py-3 rounded-4 ${
                  paymentMethod === "UPI"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setPaymentMethod("UPI")
                }
              >
                UPI Payment
              </button>

              {/* CARD */}
              <button
                className={`btn py-3 rounded-4 ${
                  paymentMethod === "CARD"
                    ? "btn-dark"
                    : "btn-outline-dark"
                }`}
                onClick={() =>
                  setPaymentMethod("CARD")
                }
              >
                Debit / Credit Card
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-4 col-12">
          <div className="card border-0 shadow-lg rounded-4 p-4" style={{ position: 'sticky', top: '80px' }}>
            <h4 className="fw-bold mb-4">
              🧾 Order Summary
            </h4>

            {/* ITEMS */}
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {cartItems.length === 0 ? (
                <p className="text-muted">
                  Cart is empty
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    className="d-flex gap-3 mb-4"
                    key={item._id}
                  >
                    {/* IMAGE */}
                    <div
                      style={{
                        position: "relative",
                        width: "70px",
                        height: "90px",
                        minWidth: "70px",
                      }}
                    >
                      <Image
                        src={
                          item.book?.image
                            ? toAssetPath(
                                item.book.image
                              )
                            : "/placeholder-book.png"
                        }
                        alt={
                          item.book?.title ||
                          "Book"
                        }
                        fill
                        sizes="70px"
                        className="rounded-3 object-fit-cover"
                      />
                    </div>

                    {/* INFO */}
                    <div>
                      <h6 className="fw-bold mb-1">
                        {item.book?.title}
                      </h6>

                      <small className="text-muted">
                        Qty: {item.quantity}
                      </small>

                      <p className="fw-bold text-success mb-0 mt-1">
                        ₹
                        {(item.book?.price ||
                          0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <hr />

            {/* SUBTOTAL */}
            <div className="d-flex justify-content-between mb-3">
              <span>Subtotal</span>

              <span>₹{totalPrice}</span>
            </div>

            {/* SHIPPING */}
            <div className="d-flex justify-content-between mb-3">
              <span>Shipping</span>

              <span className="text-success">
                Free
              </span>
            </div>

            <hr />

            {/* TOTAL */}
            <div className="d-flex justify-content-between mb-4">
              <h4 className="fw-bold">
                Total
              </h4>

              <h4 className="fw-bold text-success">
                ₹{totalPrice}
              </h4>
            </div>

            {/* PLACE ORDER BUTTON */}
            <button
              className="btn btn-dark w-100 py-3 rounded-pill fw-bold"
              onClick={handlePlaceOrder}
              disabled={
                placingOrder ||
                cartItems.length === 0
              }
            >
              {placingOrder
                ? "Placing Order..."
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
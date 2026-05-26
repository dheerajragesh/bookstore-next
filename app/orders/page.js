"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toAssetPath } from "@/utils/url";

import { fetchOrders, cancelOrder } from "@/redux/slices/orderSlice";
import { getToken, isUser } from "@/utils/auth";

export default function OrdersPage() {
  const dispatch = useDispatch();

  const { orders, loading } = useSelector((state) => state.orders);

  // ================= FETCH =================
  useEffect(() => {
    if (!getToken() || !isUser()) return;
    dispatch(fetchOrders());
  }, [dispatch]);

  // ================= CANCEL =================
  const handleCancel = async (id) => {
    try {
      await dispatch(cancelOrder(id)).unwrap();

      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>

        <p className="mt-3">Loading orders...</p>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{
        background: "linear-gradient(to right, #f8fafc, #e2e8f0)",
      }}
    >
      <div className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-5">
          <div>
            <h1 className="fw-bold display-6">📦 My Orders</h1>

            <p className="text-muted">Manage and track your purchases</p>
          </div>

          <Link href="/books" className="btn btn-dark rounded-pill px-4">
            Continue Shopping
          </Link>
        </div>

        {/* EMPTY */}
        {orders?.length === 0 ? (
          <div className="card border-0 shadow-lg rounded-5 p-5 text-center">
            <h2 className="fw-bold mb-3">No Orders Found 😢</h2>

            <p className="text-muted mb-4">
              Start shopping your favorite books.
            </p>

            <Link
              href="/books"
              className="btn btn-dark btn-lg rounded-pill px-5"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {orders?.map((order) => (
              <div className="col-12" key={order._id}>
                <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
                  {/* TOP */}
                  <div
                    className="text-white p-4"
                    style={{
                      background: "linear-gradient(to right, #111827, #1f2937)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div>
                        <h5 className="fw-bold">Order</h5>
                      </div>

                      <span
                        className={`badge px-4 py-2 rounded-pill fs-6 ${
                          order.orderStatus === "delivered"
                            ? "bg-success"
                            : order.orderStatus === "cancelled"
                              ? "bg-danger"
                              : order.orderStatus === "shipped"
                                ? "bg-info"
                                : "bg-warning text-dark"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-4">
                    {/* ITEMS */}
                    <div className="row g-4">
                      {order.items?.map((item, index) => (
                        <div className="col-md-6" key={index}>
                          <div className="border rounded-4 p-3 h-100">
                            <div className="d-flex gap-3">
                              {item.product?.image ? (
                                <img
                                  src={toAssetPath(item.product.image)}
                                  alt={item.product?.title || "Book"}
                                  width={80}
                                  height={100}
                                  className="rounded-3 object-fit-cover"
                                  style={{ objectFit: "cover" }}
                                  loading="lazy"
                                />
                              ) : (
                                <div
                                  className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "80px",
                                    height: "100px",
                                  }}
                                >
                                  No Image
                                </div>
                              )}

                              <div>
                                <h5 className="fw-bold">
                                  {item.product?.title}
                                </h5>

                                <p className="text-muted">
                                  {item.product?.author}
                                </p>

                                <h6 className="fw-bold text-success">
                                  ₹{item.product?.price}
                                </h6>

                                <span className="badge bg-dark">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* FOOTER */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap mt-4 pt-4 border-top">
                      <div>
                        <h4 className="fw-bold text-success">
                          ₹{order.totalPrice}
                        </h4>

                        <small className="text-muted">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </small>
                      </div>

                      <div className="d-flex gap-3 mt-3 mt-md-0">
                        <Link
                          href={`/orders/${order._id}`}
                          className="btn btn-outline-dark rounded-pill px-4"
                        >
                          View Details
                        </Link>

                        {order.orderStatus !== "delivered" &&
                          order.orderStatus !== "cancelled" && (
                            <button
                              className="btn btn-danger rounded-pill px-4"
                              onClick={() => handleCancel(order._id)}
                            >
                              Cancel
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toAssetPath } from "@/utils/url";

import { fetchSellerOrders } from "@/redux/slices/orderSlice";
import { getToken, isSeller } from "@/utils/auth";

export default function SellerOrdersPage() {
  const dispatch = useDispatch();

  const { sellerOrders, loading } = useSelector((state) => state.orders);

  // ================= FETCH =================
  useEffect(() => {
    if (!getToken() || !isSeller()) return;
    dispatch(fetchSellerOrders());
  }, [dispatch]);

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
            <h1 className="fw-bold display-6">📦 Orders for My Books</h1>

            <p className="text-muted">Manage orders for books you have added</p>
          </div>

          <Link href="/books" className="btn btn-dark rounded-pill px-4">
            My Books
          </Link>
        </div>

        {/* EMPTY */}
        {sellerOrders?.length === 0 ? (
          <div className="card border-0 shadow-lg rounded-5 p-5 text-center">
            <h2 className="fw-bold mb-3">No Orders Found 😢</h2>

            <p className="text-muted mb-4">
              When someone purchases your books, orders will appear here.
            </p>

            <Link
              href="/books/add"
              className="btn btn-dark btn-lg rounded-pill px-5"
            >
              Add New Book
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {sellerOrders?.map((order) => (
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
                        <h5 className="fw-bold">Order ID</h5>

                        <small>{order._id}</small>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <span
                          className={`badge px-4 py-2 rounded-pill fs-6 ${
                            order.orderStatus === "delivered"
                              ? "bg-success"
                              : order.orderStatus === "cancelled"
                                ? "bg-danger"
                                : order.orderStatus === "shipped"
                                  ? "bg-info"
                                  : order.orderStatus === "processing"
                                    ? "bg-primary"
                                    : "bg-warning text-dark"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="p-4">
                    {/* ITEMS - Filter to show only seller's books */}
                    <div className="row g-4">
                      {order.items
                        ?.filter((item) => item.product?.seller?._id === order.sellerId || item.product?.seller === order.sellerId)
                        .map((item, index) => (
                          <div className="col-md-6" key={index}>
                            <div className="border rounded-4 p-3 h-100">
                              <div className="d-flex gap-3">
                                {item.product?.image ? (
                                  <Image
                                    src={toAssetPath(item.product.image)}
                                    alt={item.product?.title || "Book"}
                                    width={80}
                                    height={100}
                                    className="rounded-3 object-fit-cover"
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
                                    ₹{item.product?.price} × {item.quantity}
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

                      <Link
                        href={`/seller/orders/${order._id}`}
                        className="btn btn-warning rounded-pill px-4"
                      >
                        Manage Order
                      </Link>
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
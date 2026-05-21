"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toAssetPath } from "@/utils/url";

import { fetchSingleOrder } from "@/redux/slices/orderSlice";
import { getToken, isUser } from "@/utils/auth";

export default function SingleOrderPage() {
  const params = useParams();

  const dispatch = useDispatch();

  const { singleOrder, loading } = useSelector((state) => state.orders);

  // ================= FETCH =================
  useEffect(() => {
    if (params.id) {
      if (!getToken() || !isUser()) return;
      dispatch(fetchSingleOrder(params.id));
    }
  }, [dispatch, params.id]);

  // ================= LOADING =================
  if (loading || !singleOrder) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>

        <p className="mt-3">Loading order details...</p>
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
        {/* BACK */}
        <Link
          href="/orders"
          className="btn btn-outline-dark rounded-pill px-4 mb-4"
        >
          ← Back to Orders
        </Link>

        {/* CARD */}
        <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
          {/* HEADER */}
          <div
            className="text-white p-5"
            style={{
              background: "linear-gradient(to right, #111827, #1f2937)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h2 className="fw-bold mb-2">Order Details</h2>

                <p className="mb-0">{singleOrder._id}</p>
              </div>

              <span
                className={`badge px-4 py-3 rounded-pill fs-6 ${
                  singleOrder.orderStatus === "delivered"
                    ? "bg-success"
                    : singleOrder.orderStatus === "cancelled"
                      ? "bg-danger"
                      : singleOrder.orderStatus === "shipped"
                        ? "bg-info"
                        : "bg-warning text-dark"
                }`}
              >
                {singleOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* BODY */}
          <div className="p-5">
            {/* PRODUCTS */}
            <h4 className="fw-bold mb-4">Ordered Products</h4>

            <div className="row g-4">
              {singleOrder.items?.map((item, index) => (
                <div className="col-md-6" key={index}>
                  <div className="border rounded-5 p-4 h-100">
                    <div className="d-flex gap-3">
                      {/* IMAGE */}
                      {item.product?.image ? (
                        <Image
                          src={toAssetPath(item.product.image)}
                          alt={item.product?.title || "Book"}
                          width={90}
                          height={120}
                          className="rounded-3 object-fit-cover"
                        />
                      ) : (
                        <div
                          className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: "90px",
                            height: "120px",
                          }}
                        >
                          No Image
                        </div>
                      )}

                      {/* DETAILS */}
                      <div>
                        <h5 className="fw-bold">{item.product?.title}</h5>

                        <p className="text-muted">{item.product?.author}</p>

                        <h5 className="text-success fw-bold">
                          ₹{item.product?.price}
                        </h5>

                        <span className="badge bg-dark">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ADDRESS */}
            <div className="mt-5">
              <h4 className="fw-bold mb-3">📍 Shipping Address</h4>

              <div className="card border-0 bg-light rounded-4 p-4">
                <p className="mb-0 text-muted">{singleOrder.address}</p>
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-5 d-flex justify-content-between align-items-center flex-wrap border-top pt-4">
              <div>
                <h3 className="fw-bold text-success">
                  Total Amount: ₹{singleOrder.totalPrice}
                </h3>

                <p className="text-muted mb-0">
                  Ordered on{" "}
                  {new Date(singleOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

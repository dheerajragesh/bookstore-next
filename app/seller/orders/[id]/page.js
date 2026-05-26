"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { toAssetPath } from "@/utils/url";

import { fetchSellerOrders, updateOrderStatus } from "@/redux/slices/orderSlice";
import { getToken, isSeller } from "@/utils/auth";

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-warning text-dark" },
  { value: "processing", label: "Processing", color: "bg-primary" },
  { value: "shipped", label: "Shipped", color: "bg-info" },
  { value: "delivered", label: "Delivered", color: "bg-success" },
  { value: "cancelled", label: "Cancelled", color: "bg-danger" },
];

export default function SellerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { sellerOrders, loading } = useSelector((state) => state.orders);

  const order = sellerOrders?.find((o) => o._id === params.id);

  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const effectiveSelectedStatus =
    selectedStatus || order?.orderStatus || "";

  // ================= FETCH =================
  useEffect(() => {
    if (!getToken() || !isSeller()) return;
    if (sellerOrders.length === 0) {
      dispatch(fetchSellerOrders());
    }
  }, [dispatch, sellerOrders.length]);



  // Keep seller order status selector in sync only with user selection.
  // (No “setState inside effect” lint issues.)
  // ================= UPDATE STATUS =================
  const handleStatusUpdate = async () => {
    if (!effectiveSelectedStatus) return;
    if (effectiveSelectedStatus === order?.orderStatus) return;

    setIsUpdating(true);
    try {
      await dispatch(
        updateOrderStatus({
          orderId: params.id,
          status: effectiveSelectedStatus,
        })
      ).unwrap();
      toast.success("Order status updated successfully");
    } catch (err) {
      toast.error(err || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  // ================= LOADING =================
  if (loading && sellerOrders.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark"></div>

        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold mb-3">Order Not Found</h2>

        <Link href="/seller/orders" className="btn btn-dark rounded-pill px-4">
          Back to Orders
        </Link>
      </div>
    );
  }

  // Filter items to show only seller's books
  const sellerItems = order.items?.filter(
    (item) => item.product?.seller?._id === order.sellerId || item.product?.seller === order.sellerId
  );

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
          href="/seller/orders"
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

                <p className="mb-0">{order._id}</p>
              </div>

              <span
                className={`badge px-4 py-3 rounded-pill fs-6 ${
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

          {/* BODY */}
          <div className="p-5">
            {/* PRODUCTS */}
            <h4 className="fw-bold mb-4">Products in this Order</h4>

            <div className="row g-4">
              {sellerItems?.map((item, index) => (
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
                <p className="mb-0 text-muted">{order.address}</p>
              </div>
            </div>

            {/* STATUS UPDATE - SELLER ONLY */}
            <div className="mt-5">
              <h4 className="fw-bold mb-3">📝 Update Order Status</h4>

              <div className="card border-0 bg-light rounded-4 p-4">
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <select
                    className="form-select"
                    style={{ maxWidth: "250px" }}
                    value={effectiveSelectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={isUpdating}
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn btn-success rounded-pill px-4"
                    onClick={handleStatusUpdate}
                    disabled={
                      isUpdating ||
                      !effectiveSelectedStatus ||
                      effectiveSelectedStatus === order.orderStatus
                    }
                  >
                    {isUpdating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>

                {effectiveSelectedStatus === order.orderStatus && (
                  <p className="text-muted mt-3 mb-0">
                    This is the current status. Select a different status to
                    update.
                  </p>
                )}
              </div>
            </div>

            {/* TOTAL */}
            <div className="mt-5 d-flex justify-content-between align-items-center flex-wrap border-top pt-4">
              <div>
                <h3 className="fw-bold text-success">
                  Order Total: ₹{order.totalPrice}
                </h3>

                <p className="text-muted mb-0">
                  Ordered on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
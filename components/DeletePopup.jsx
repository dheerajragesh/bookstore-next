"use client";

export default function DeletePopup({
  show,
  onClose,
  onConfirm,
  loading,
}) {

  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
    >

      <div
        className="bg-white rounded-4 shadow-lg p-4"
        style={{
          width: "90%",
          maxWidth: "420px",
        }}
      >

        {/* ICON */}
        <div className="text-center mb-3">

          <div
            className="bg-danger-subtle rounded-circle d-inline-flex justify-content-center align-items-center"
            style={{
              width: "80px",
              height: "80px",
            }}
          >
            <span
              style={{
                fontSize: "40px",
              }}
            >
              🗑️
            </span>
          </div>

        </div>

        {/* TITLE */}
        <h3 className="fw-bold text-center mb-2">
          Delete Book?
        </h3>

        {/* MESSAGE */}
        <p className="text-muted text-center mb-4">
          This action cannot be undone.
          Are you sure you want to delete this book?
        </p>

        {/* BUTTONS */}
        <div className="d-flex gap-3">

          <button
            className="btn btn-outline-dark w-100"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="btn btn-danger w-100"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}
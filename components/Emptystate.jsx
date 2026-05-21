"use client";

export default function EmptyState({
  title,
  subtitle,
}) {
  return (
    <div className="text-center py-5">
      <h3 className="fw-bold mb-3">
        {title}
      </h3>

      <p className="text-muted">
        {subtitle}
      </p>
    </div>
  );
}
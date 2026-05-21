"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAdmin } from "@/utils/auth";
import AdminSidebar from "@/components/Adminsidebar";
import { toast } from "react-toastify";

function numberToWords(num) {
  // Simple number-to-words for non-negative integers (0 - 999999)
  const ones = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const toUnder100 = (n) => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    const t = Math.floor(n / 10);
    const r = n % 10;
    return r === 0 ? tens[t] : `${tens[t]}-${ones[r]}`;
  };

  const toUnder1000 = (n) => {
    if (n < 100) return toUnder100(n);
    const h = Math.floor(n / 100);
    const r = n % 100;
    return r === 0
      ? `${ones[h]} hundred`
      : `${ones[h]} hundred ${toUnder100(r)}`;
  };

  const toWords = (n) => {
    if (n === 0) return ones[0];
    if (n < 1000) return toUnder1000(n);
    if (n < 1000000) {
      const th = Math.floor(n / 1000);
      const r = n % 1000;
      return r === 0
        ? `${toUnder1000(th)} thousand`
        : `${toUnder1000(th)} thousand ${toUnder1000(r)}`;
    }
    return String(n);
  };

  const safe = Math.floor(Number(num));
  if (!Number.isFinite(safe) || safe < 0) return "—";
  return toWords(safe);
}


export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    users: null,
    books: null,
  });

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Admin access only");
      router.push("/login");
      return;
    }

    const run = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats({
          users: res.data?.users ?? null,
          books: res.data?.books ?? null,
        });
      } catch {
        // No-op
      }
    };

    void run();
  }, [router]);

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-3">
          <AdminSidebar />
        </div>

        <div className="col-lg-9">
          <div className="d-flex flex-column gap-3">
            <div>
              <h1 className="fw-bold">Admin Dashboard</h1>
              <p className="text-muted mb-0">Manage users and books.</p>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <div
                  className="card border-0 shadow-sm rounded-4 p-4 h-100"
                  style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}
                >
                  <div className="text-muted" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Total Users
                  </div>
                  <div className="fw-bold fs-3 text-white">
                    {stats.users === null ? "—" : stats.users}
                  </div>

                  <div className="d-flex flex-column mt-1">
                    <div className="text-white-50" style={{ fontSize: 12 }}>
                      Total users (words)
                    </div>
                    <div
                      className="text-white-50"
                      style={{ fontSize: 12, fontStyle: "italic" }}
                    >
                      {stats.users === null || typeof stats.users !== "number"
                        ? "—"
                        : `${numberToWords(stats.users)} users`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div
                  className="card border-0 shadow-sm rounded-4 p-4 h-100"
                  style={{ background: "linear-gradient(135deg, #111827, #374151)" }}
                >
                  <div className="text-muted" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Books Overview
                  </div>
                  <div className="fw-bold fs-3 text-white">
                    {stats.books === null ? "—" : stats.books}
                  </div>
                  <div className="text-white-50 mt-1">Total books uploaded</div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="fw-bold mb-2">Quick actions</div>
              <div className="text-muted">Use the sidebar to view users and books.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


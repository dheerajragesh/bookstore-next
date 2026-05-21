"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAdmin } from "@/utils/auth";
import AdminSidebar from "@/components/Adminsidebar";
import { toast } from "react-toastify";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const pageSize = 8;

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  const pagedUsers = useMemo(() => {
    return users.slice((page - 1) * pageSize, page * pageSize);
  }, [users, page]);

  useEffect(() => {
    if (!isAdmin()) {
      toast.error("Admin access only");
      router.push("/login");
      return;
    }

    const run = async () => {
      try {
        setLoading(true);

        let res;
        try {
          res = await api.get("/admin/users");
        } catch {
          res = await api.get("/users");
        }

        setUsers(res.data?.data || res.data?.users || []);
      } catch {
        toast.error("Failed to load users (endpoint may differ). ");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [router]);

  const handleDelete = async (id) => {
    try {
      if (!confirm("Delete this user?")) return;

      try {
        await api.delete(`/admin/users/${id}`);
      } catch {
        await api.delete(`/users/${id}`);
      }

      setUsers((prev) => prev.filter((u) => (u._id || u.id) !== id));
      setPage((p) => Math.max(1, p - 1));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user (endpoint may differ). ");
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-start align-items-start">
        <div className="col-lg-3">
          <AdminSidebar />
        </div>

        <div className="col-lg-9" style={{ maxWidth: 720 }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="w-100">
              <h1 className="fw-bold mb-0">Users</h1>
              <div className="text-muted small">Manage registered users</div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            {loading ? (
              <div className="p-5 text-center">
                <div className="spinner-border text-dark" />
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: "45%" }}>Email</th>
                        <th style={{ width: "25%" }}>Role</th>
                        <th style={{ width: 160 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="text-center text-muted py-4">
                            No users found.
                          </td>
                        </tr>
                      ) : (
                        pagedUsers.map((u) => (
                          <tr key={u._id || u.id}>
                            <td className="text-truncate" style={{ maxWidth: 320 }}>
                              {u.email || "—"}
                            </td>
                            <td className="text-center align-middle">
                              <span className="badge text-bg-secondary">
                                {u.role || "—"}
                              </span>
                            </td>
                            <td className="text-end align-middle">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(u._id || u.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 p-3 border-top">
                    <div className="text-muted small">
                      Page <b className="text-dark">{page}</b> of {totalPages}
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


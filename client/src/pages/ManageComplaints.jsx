import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function ManageComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'resolved'

  // Helper to retrieve auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/complaints/admin`, {
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to load complaints");
      }

      if (data?.success) {
        setComplaints(data.allComplaints || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const updateStatus = async (complaintId, newStatus) => {
    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_BASE_URL}/complaints/admin/${complaintId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to update complaint status");
      }

      if (data?.success) {
        setSuccess(`Complaint marked as ${newStatus}!`);
        setComplaints((prev) =>
          prev.map((c) =>
            c.complaintId === complaintId ? { ...c, status: newStatus } : c
          )
        );
      }
    } catch (err) {
      setError(err.message || "Failed to update complaint status");
    }
  };

  const deleteComplaint = async (complaintId) => {
    const confirmed = window.confirm("Are you sure you want to permanently delete this complaint?");
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_BASE_URL}/complaints/admin/${complaintId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to delete complaint");
      }

      if (data?.success) {
        setSuccess("Complaint deleted successfully!");
        setComplaints((prev) => prev.filter((c) => c.complaintId !== complaintId));
      }
    } catch (err) {
      setError(err.message || "Failed to delete complaint");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="text-2xl font-bold">
              PG360
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link to="/admin/dashboard" className="hover:text-slate-900">Dashboard</Link>
              <Link to="/admin/hostels" className="hover:text-slate-900">Hostels</Link>
              <Link to="/admin/complaints" className="text-slate-900 font-semibold">Complaints</Link>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Manage Complaints
          </h1>
          <p className="text-slate-500 mt-2">
            Review, track and resolve maintenance requests and issues reported by tenants.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => setFilter("all")}
            className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer transition ${
              filter === "all" ? "ring-2 ring-slate-900 border-slate-900" : "hover:border-slate-300"
            }`}
          >
            <p className="text-sm font-medium text-slate-500">Total Complaints</p>
            <h2 className="text-3xl font-bold mt-2 text-slate-900">
              {complaints.length}
            </h2>
          </div>

          <div
            onClick={() => setFilter("pending")}
            className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer transition ${
              filter === "pending" ? "ring-2 ring-amber-600 border-amber-600" : "hover:border-slate-300"
            }`}
          >
            <p className="text-sm font-medium text-slate-500">Pending</p>
            <h2 className="text-3xl font-bold mt-2 text-amber-600">
              {complaints.filter((c) => c.status === "pending").length}
            </h2>
          </div>

          <div
            onClick={() => setFilter("resolved")}
            className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer transition ${
              filter === "resolved" ? "ring-2 ring-emerald-600 border-emerald-600" : "hover:border-slate-300"
            }`}
          >
            <p className="text-sm font-medium text-slate-500">Resolved</p>
            <h2 className="text-3xl font-bold mt-2 text-emerald-600">
              {complaints.filter((c) => c.status === "resolved").length}
            </h2>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {["all", "pending", "resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition cursor-pointer ${
                  filter === tab
                    ? "bg-slate-900 text-white"
                    : "bg-white border text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredComplaints.length} of {complaints.length} tickets
          </span>
        </div>

        {/* Complaints List */}
        {loading ? (
          <div className="bg-white border rounded-xl p-16 text-center shadow-sm">
            <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500 text-sm">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white border rounded-xl p-16 text-center shadow-sm">
            <p className="text-slate-600 font-medium">No complaints match your current filter.</p>
            <p className="text-slate-400 text-xs mt-1">When tenants raise issues, they will appear in this inbox.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.complaintId}
                className="bg-white border rounded-xl p-6 shadow-sm hover:border-slate-300 transition"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {complaint.title}
                      </h2>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getStatusBadge(
                          complaint.status
                        )}`}
                      >
                        {complaint.status}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                      {complaint.description}
                    </p>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-800 block">Tenant:</span>
                        {complaint.tenantName || "Unknown"}
                      </div>

                      <div>
                        <span className="font-semibold text-slate-800 block">Email:</span>
                        {complaint.tenantEmail || "—"}
                      </div>

                      <div>
                        <span className="font-semibold text-slate-800 block">Hostel / Room:</span>
                        {complaint.hostelName || "Hostel"} {complaint.roomName ? `(${complaint.roomName})` : ""}
                      </div>

                      <div>
                        <span className="font-semibold text-slate-800 block">Date Reported:</span>
                        {complaint.createdAt
                          ? new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recently"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col justify-end gap-2 min-w-[160px]">
                    {complaint.status === "pending" ? (
                      <button
                        onClick={() => updateStatus(complaint.complaintId, "resolved")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        ✓ Mark Resolved
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(complaint.complaintId, "pending")}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        ↺ Reopen (Pending)
                      </button>
                    )}

                    <button
                      onClick={() => deleteComplaint(complaint.complaintId)}
                      className="border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
                    >
                      Delete Ticket
                    </button>
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
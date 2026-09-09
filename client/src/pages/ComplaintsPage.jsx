import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function ComplaintsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_BASE_URL}/complaints/tenant`, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to load complaints");
      }

      if (data?.success) {
        setComplaints(data.myComplaints || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user?.roomId) {
      setError("You cannot raise a complaint until you are assigned to a room by your PG administrator.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/complaints/tenant`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to submit complaint. Please check if you are assigned to a room.");
      }

      if (data?.success) {
        setSuccess("Complaint submitted successfully! Your PG admin has been notified.");
        setFormData({ title: "", description: "" });
        fetchMyComplaints();
      }
    } catch (err) {
      setError(err.message || "Failed to submit complaint. Please check if you are assigned to a room.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (complaintId) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel and delete this complaint?");
    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");
      const response = await fetch(`${API_BASE_URL}/complaints/tenant/${complaintId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to delete complaint");
      }

      if (data?.success) {
        setSuccess("Complaint removed successfully.");
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/tenant/dashboard" className="text-2xl font-bold">
              PG360
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link to="/tenant/dashboard" className="hover:text-slate-900">Dashboard</Link>
              <Link to="/tenant/complaint" className="text-slate-900 font-semibold">My Complaints</Link>
            </div>
          </div>

          <button
            onClick={() => navigate("/tenant/dashboard")}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Helpdesk & Complaints</h1>
          <p className="text-slate-500 mt-2">
            Raise maintenance requests for electrical, plumbing, WiFi, or room issues and track their resolution status.
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

        {!user?.roomId && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <strong>Room Assignment Needed:</strong> You have not been assigned to a room yet. Please contact your hostel administrator so they can link your account to a room before filing complaints.
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* New Complaint Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-4 text-slate-900">
                Raise New Issue
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Subject / Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WiFi not connecting"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">
                    Description
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the issue in detail (e.g. location, since when, symptoms)..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-slate-900 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting || !user?.roomId}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white py-3 rounded-lg font-medium text-sm transition cursor-pointer"
                >
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
              </form>
            </div>
          </div>

          {/* Complaint History */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Your Complaint History
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {complaints.length} {complaints.length === 1 ? "Ticket" : "Tickets"}
                </span>
              </div>

              {loading ? (
                <div className="text-center py-16 text-slate-500">
                  <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  Loading complaints...
                </div>
              ) : complaints.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-dashed rounded-xl">
                  <p className="font-medium text-slate-700 text-sm">No complaints logged yet.</p>
                  <p className="text-xs text-slate-400 mt-1">If anything needs maintenance in your room, submit a ticket on the left.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div
                      key={complaint.complaintId}
                      className="border rounded-xl p-5 hover:border-slate-300 transition bg-white"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-base text-slate-900">
                              {complaint.title}
                            </h3>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${getStatusBadge(
                                complaint.status
                              )}`}
                            >
                              {complaint.status}
                            </span>
                          </div>

                          <p className="text-slate-600 text-sm mt-2 whitespace-pre-wrap leading-relaxed">
                            {complaint.description}
                          </p>

                          <p className="text-xs text-slate-400 mt-3">
                            Reported on{" "}
                            {complaint.createdAt
                              ? new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Recently"}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          {complaint.status === "pending" && (
                            <button
                              onClick={() => handleDelete(complaint.complaintId)}
                              className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline cursor-pointer"
                            >
                              Cancel / Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
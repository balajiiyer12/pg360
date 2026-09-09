import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function ManageHostels() {
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Helper to retrieve auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchHostels = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/admin/hostel`, {
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to load hostels");
      }

      if (data?.success) {
        setHostels(data.allHostels || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load hostels");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHostels();
  }, [fetchHostels]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const url = editingId
        ? `${API_BASE_URL}/admin/hostel/${editingId}`
        : `${API_BASE_URL}/admin/hostel`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Operation failed. Please try again.");
      }

      if (data?.success) {
        setSuccess(
          editingId
            ? "Hostel updated successfully!"
            : "Hostel registered successfully!"
        );
        setEditingId(null);
        setFormData({
          name: "",
          description: "",
        });
        fetchHostels();
      }
    } catch (err) {
      setError(err.message || "Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (hostel) => {
    setEditingId(hostel.hostelId);
    setFormData({
      name: hostel.name,
      description: hostel.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hostel? All associated rooms and tenant assignments will be impacted."
    );
    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_BASE_URL}/admin/hostel/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to delete hostel");
      }

      if (data?.success) {
        setSuccess("Hostel deleted successfully!");
        setHostels((prev) => prev.filter((h) => h.hostelId !== id));
      }
    } catch (err) {
      setError(err.message || "Failed to delete hostel");
    }
  };

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
              <Link to="/admin/hostels" className="text-slate-900 font-semibold">Hostels</Link>
              <Link to="/admin/complaints" className="hover:text-slate-900">Complaints</Link>
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
          <h1 className="text-3xl font-semibold">
            Manage Hostels
          </h1>
          <p className="text-slate-500 mt-2">
            Create, update and manage your PG and hostel properties.
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div>
            <div className="bg-white border rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {editingId ? "Edit Hostel" : "Register Hostel"}
                </h2>
                {editingId && (
                  <button
                    onClick={handleCancelEdit}
                    className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hostel Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. Sunrise Luxury PG"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Short description, amenities, nearby landmarks..."
                    className="w-full border rounded-lg px-4 py-3 resize-none outline-none focus:border-slate-900 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg py-3 font-medium transition cursor-pointer"
                >
                  {submitting
                    ? "Saving..."
                    : editingId
                    ? "Update Hostel"
                    : "Register Hostel"}
                </button>
              </form>
            </div>
          </div>

          {/* Hostel List */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  Your Hostels
                </h2>
                <span className="text-sm text-slate-500 font-medium">
                  {hostels.length} {hostels.length === 1 ? "Hostel" : "Hostels"}
                </span>
              </div>

              {loading ? (
                <div className="text-center py-16 text-slate-500">
                  <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  Loading hostels...
                </div>
              ) : hostels.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border-2 border-dashed rounded-xl">
                  <p className="font-medium text-slate-700">No hostels registered yet.</p>
                  <p className="text-sm text-slate-400 mt-1">Use the form on the left to add your first hostel property.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hostels.map((hostel) => (
                    <div
                      key={hostel.hostelId}
                      className="border rounded-xl p-5 hover:border-slate-300 transition bg-white"
                    >
                      <div
                        onClick={() => navigate(`/admin/hostels/${hostel.hostelId}`)}
                        className="cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-slate-900 group-hover:text-slate-700">
                            {hostel.name}
                          </h3>
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            Hostel ID: {hostel.hostelId?.slice(0, 8)}...
                          </span>
                        </div>

                        <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                          {hostel.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-5 pt-4 border-t">
                        <button
                          onClick={() => handleEdit(hostel)}
                          className="border rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-50 transition cursor-pointer"
                        >
                          Edit Details
                        </button>

                        <button
                          onClick={() => handleDelete(hostel.hostelId)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium px-2 py-1 transition cursor-pointer"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() => navigate(`/admin/hostels/${hostel.hostelId}`)}
                          className="ml-auto text-sm font-medium text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Manage Rooms & Tenants →
                        </button>
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
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    hostels: 0,
    rooms: 0,
    tenants: 0,
    complaints: 0,
    occupancy: "0%",
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // Retrieve saved JWT

        const response = await fetch(`${API_BASE_URL}/admin/hostel/stats/overview`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : "", // Send Bearer Token
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || data?.msg || "Failed to load dashboard data");
        }

        if (data?.success) {
          setStats(data.stats);
          setRecentActivity(data.recentActivity || []);
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="text-2xl font-bold">
              PG360 <span className="text-xs uppercase bg-slate-100 text-slate-700 px-2 py-1 rounded font-semibold ml-2">Admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link to="/admin/hostels" className="hover:text-slate-900">Hostels</Link>
              <Link to="/admin/complaints" className="hover:text-slate-900">Complaints</Link>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border rounded-lg text-red-600 border-red-200 hover:bg-red-50 text-sm font-medium transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Welcome, {user?.name || "Admin"}
          </h2>
          <p className="text-slate-500 mt-2">
            Manage hostels, tenants, complaints and monitor platform activity.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Analytics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Hostels</p>
            <h3 className="text-3xl font-bold mt-2">
              {loading ? "..." : stats.hostels}
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Tenants</p>
            <h3 className="text-3xl font-bold mt-2">
              {loading ? "..." : stats.tenants}
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Open Complaints</p>
            <h3 className="text-3xl font-bold mt-2 text-amber-600">
              {loading ? "..." : stats.complaints}
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Occupancy</p>
            <h3 className="text-3xl font-bold mt-2 text-emerald-600">
              {loading ? "..." : stats.occupancy}
            </h3>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">
            Admin Profile
          </h3>

          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-slate-500 block">Name</span>
              <span className="font-semibold text-slate-900 text-base">{user?.name}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Email</span>
              <span className="font-semibold text-slate-900 text-base">{user?.email}</span>
            </div>

            <div>
              <span className="text-slate-500 block">Account Role</span>
              <span className="inline-block mt-1 uppercase text-xs tracking-wider px-2.5 py-0.5 rounded-full font-bold bg-slate-900 text-white">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Hostels */}
          <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">Manage Hostels</h3>
                <span className="text-sm bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                  {stats.hostels} Properties
                </span>
              </div>
              <p className="text-slate-600 mb-6">
                Register new hostels, manage rooms, pricing, and view tenant assignments.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/hostels")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition cursor-pointer"
            >
              Open Hostel Management →
            </button>
          </div>

          {/* Complaints */}
          <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">Manage Complaints</h3>
                <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${
                  stats.complaints > 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {stats.complaints} Pending
                </span>
              </div>
              <p className="text-slate-600 mb-6">
                Review, resolve, and monitor tenant issues across all your properties.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/complaints")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition cursor-pointer"
            >
              Open Complaint Desk →
            </button>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4">
            Recent Activity
          </h3>

          {loading ? (
            <p className="text-slate-500 text-sm py-4">Loading activity...</p>
          ) : recentActivity.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">No recent activity found. As tenants raise complaints or you add hostels, updates will appear here.</p>
          ) : (
            <div className="divide-y text-sm">
              {recentActivity.map((activity, idx) => (
                <div key={activity.id || idx} className="py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-900 flex-shrink-0"></div>
                  <span className="text-slate-700">{activity.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function TenantDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [paymentStatus, setPaymentStatus] = useState("Pending");

  const room = user?.room;
  const rentAmount = room?.rent || 0;

  const handlePayment = () => {
    alert(`Payment of ₹${rentAmount.toLocaleString()} simulated successfully!`);
    setPaymentStatus("Paid");
  };

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
            <Link to="/tenant/dashboard" className="text-2xl font-bold">
              PG360 <span className="text-xs uppercase bg-slate-100 text-slate-700 px-2 py-1 rounded font-semibold ml-2">Tenant</span>
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link to="/tenant/dashboard" className="text-slate-900 font-semibold">Dashboard</Link>
              <Link to="/tenant/complaint" className="hover:text-slate-900">My Complaints</Link>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="border px-4 py-2 rounded-lg text-red-600 border-red-200 hover:bg-red-50 text-sm font-medium transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.name || "Tenant"}
          </h2>
          <p className="text-slate-500 mt-2">
            {room?.hostelName
              ? `Resident at ${room.hostelName}`
              : "Manage your stay, rent schedule, and complaints."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Assigned Room</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900">
              {room?.roomName || "Unassigned"}
            </h3>
            {room?.hostelName && (
              <p className="text-xs text-slate-500 mt-1">{room.hostelName}</p>
            )}
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Monthly Rent</p>
            <h3 className="text-3xl font-bold mt-2 text-slate-900">
              {rentAmount > 0 ? `₹${rentAmount.toLocaleString()}` : "Not Set"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Due on 1st of every month</p>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Rent Status (This Month)</p>
            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                paymentStatus === "Paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {paymentStatus}
            </span>
          </div>
        </div>

        {/* Pay Rent Section */}
        {rentAmount > 0 && (
          <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-2 text-slate-900">
              Rent Payment
            </h3>
            <p className="text-slate-600 mb-4 text-sm">
              Amount Due: <strong>₹{rentAmount.toLocaleString()}</strong> for the current billing cycle.
            </p>

            <button
              onClick={handlePayment}
              disabled={paymentStatus === "Paid"}
              className={`px-5 py-3 rounded-lg font-medium text-sm transition cursor-pointer ${
                paymentStatus === "Paid"
                  ? "bg-emerald-600 text-white cursor-not-allowed opacity-90"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              {paymentStatus === "Paid" ? "✓ Rent Paid for this Month" : "Pay Rent Now"}
            </button>
          </div>
        )}

        {/* Profile + Complaint Quick Access */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-slate-900">
              Tenant Profile
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold text-slate-900">{user?.name}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-900">{user?.email}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-slate-500">Hostel</span>
                <span className="font-semibold text-slate-900">{room?.hostelName || "Not Assigned"}</span>
              </div>

              <div className="flex justify-between pb-2">
                <span className="text-slate-500">Room</span>
                <span className="font-semibold text-slate-900">{room?.roomName || "Not Assigned"}</span>
              </div>
            </div>
          </div>

          {/* Complaints Quick Access */}
          <div className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">
                Helpdesk & Complaints
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Have a maintenance request or facing an issue with electricity, plumbing, or WiFi in your room?
              </p>
            </div>

            <button
              onClick={() => navigate("/tenant/complaint")}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Raise or Track Complaint →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TenantDashboard() {
  const navigate = useNavigate();

  const [paymentStatus, setPaymentStatus] = useState("Pending");

  const rentAmount = 8500;

  const handlePayment = () => {
    alert(`₹${rentAmount} paid successfully!`);
    setPaymentStatus("Paid");
  };

  const tenant = {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    room: "A-204",
    phone: "9876543210",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <h1 className="text-2xl font-bold">PG360</h1>

    <button
      onClick={() => {
        localStorage.removeItem("token");
        navigate("/login");
      }}
      className="border px-4 py-2 rounded-lg text-red-600 border-red-200 hover:bg-red-50"
    >
      Logout
    </button>
  </div>
</nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Welcome, {tenant.name}
          </h2>

          <p className="text-slate-500 mt-2">
            Manage your stay and payments efficiently.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border rounded-xl p-6">
            <p className="text-slate-500 text-sm">Room Number</p>
            <h3 className="text-3xl font-bold mt-2">
              {tenant.room}
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-slate-500 text-sm">Monthly Rent</p>
            <h3 className="text-3xl font-bold mt-2">
              ₹{rentAmount}
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-slate-500 text-sm">Status</p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                paymentStatus === "Paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {paymentStatus}
            </span>
          </div>
        </div>

        {/* Pay Rent */}
        <div className="bg-white border rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Rent Payment
          </h3>

          <p className="text-slate-600 mb-4">
            Amount Due: ₹{rentAmount}
          </p>

          <button
            onClick={handlePayment}
            disabled={paymentStatus === "Paid"}
            className={`px-5 py-3 rounded-lg font-medium ${
              paymentStatus === "Paid"
                ? "bg-green-600 text-white cursor-not-allowed"
                : "bg-slate-900 text-white"
            }`}
          >
            {paymentStatus === "Paid"
              ? "Payment Completed"
              : "Pay Now"}
          </button>
        </div>

        {/* Payment History */}
        <div className="bg-white border rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Payment History
          </h3>

          <div className="flex justify-between border-b py-3">
            <span>August 2026</span>
            <span className="text-green-600">
              ₹8500 Paid
            </span>
          </div>

          <div className="flex justify-between py-3">
            <span>September 2026</span>
            <span
              className={
                paymentStatus === "Paid"
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              ₹8500 {paymentStatus}
            </span>
          </div>
        </div>

        {/* Profile + Complaint */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Tenant Profile
            </h3>

            <div className="space-y-3">
              <p>
                <strong>Name:</strong> {tenant.name}
              </p>

              <p>
                <strong>Email:</strong> {tenant.email}
              </p>

              <p>
                <strong>Phone:</strong> {tenant.phone}
              </p>

              <p>
                <strong>Room:</strong> {tenant.room}
              </p>
            </div>
          </div>

          {/* Complaints */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Complaints
            </h3>

            <p className="text-slate-600 mb-4">
              Facing any issues in your room or PG?
            </p>

            <button
              onClick={() => navigate("/complaints")}
              className="bg-slate-900 text-white px-5 py-3 rounded-lg"
            >
              Raise Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
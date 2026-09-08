import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const admin = {
    name: "Balaji Iyer",
    email: "admin@pg360.com",
    role: "Admin",
  };

  const analytics = {
    hostels: 12,
    tenants: 284,
    complaints: 17,
    occupancy: "91%",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">PG360 Admin</h1>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border rounded-lg text-red-600 border-red-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Welcome, {admin.name}
          </h2>
          <p className="text-slate-500 mt-2">
            Manage hostels, tenants, complaints and monitor platform activity.
          </p>
        </div>

        {/* Analytics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-slate-500">Total Hostels</p>
            <h3 className="text-3xl font-bold mt-2">
              {analytics.hostels}
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-slate-500">Total Tenants</p>
            <h3 className="text-3xl font-bold mt-2">
              {analytics.tenants}
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-slate-500">Open Complaints</p>
            <h3 className="text-3xl font-bold mt-2">
              {analytics.complaints}
            </h3>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <p className="text-sm text-slate-500">Occupancy</p>
            <h3 className="text-3xl font-bold mt-2">
              {analytics.occupancy}
            </h3>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="bg-white border rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Profile
          </h3>

          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {admin.name}
            </p>

            <p>
              <strong>Email:</strong> {admin.email}
            </p>

            <p>
              <strong>Role:</strong> {admin.role}
            </p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Complaints */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">
              Manage Complaints
            </h3>

            <p className="text-slate-600 mb-4">
              View, update and resolve tenant complaints.
            </p>

            <button
              onClick={() => navigate("/admin/complaints")}
              className="w-full bg-slate-900 text-white py-3 rounded-lg"
            >
              Open
            </button>
          </div>

          {/* Hostels */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">
              Manage Hostels
            </h3>

            <p className="text-slate-600 mb-4">
              Register new hostels and manage existing properties.
            </p>

            <button
              onClick={() => navigate("/admin/hostels")}
              className="w-full bg-slate-900 text-white py-3 rounded-lg"
            >
              Open
            </button>
          </div>
        </div>

        {/* Activity Section */}
        <div className="bg-white border rounded-xl p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Recent Activity
          </h3>

          <div className="space-y-3">
            <div className="border-b pb-3">
              Complaint #102 marked as resolved.
            </div>

            <div className="border-b pb-3">
              New hostel "Sunrise PG" registered.
            </div>

            <div>
              Tenant Rahul Sharma registered.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PG360LandingPage() {
  const { isAuthenticated, role } = useAuth();
  const dashboardLink = role === "admin" ? "/admin/dashboard" : "/tenant/dashboard";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            PG360
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#stats" className="hover:text-slate-900">Overview</a>
          </div>

          <div className="flex gap-3">
            {isAuthenticated ? (
              <Link
                to={dashboardLink}
                className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-slate-50 transition">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              PG Management Simplified
            </span>

            <h1 className="mt-4 text-5xl font-bold leading-tight">
              Manage Your PG
              <br />
              From One Dashboard
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Track tenants, collect rent, monitor occupancy,
              manage complaints, and streamline operations with PG360.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                to={isAuthenticated ? dashboardLink : "/signup"}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium transition cursor-pointer"
              >
                {isAuthenticated ? "Go to Dashboard →" : "Get Started Free"}
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-md font-medium transition cursor-pointer"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="border rounded-2xl p-6 bg-slate-50">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-slate-500">Total Rooms</p>
                <h3 className="text-3xl font-bold">120</h3>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-slate-500">Occupied</p>
                <h3 className="text-3xl font-bold">106</h3>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-slate-500">Rent Collected</p>
                <h3 className="text-3xl font-bold">₹4.8L</h3>
              </div>

              <div className="bg-white border rounded-xl p-4">
                <p className="text-sm text-slate-500">Complaints</p>
                <h3 className="text-3xl font-bold">8</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-6 py-20 border-t"
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-3">
              Tenant Management
            </h3>
            <p className="text-slate-600">
              Manage tenant records, check-ins, and vacancies.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Rent Tracking
            </h3>
            <p className="text-slate-600">
              Monitor payments and generate rent reports.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              Complaint Management
            </h3>
            <p className="text-slate-600">
              Track and resolve maintenance requests efficiently.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
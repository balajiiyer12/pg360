import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">PG360</h1>
          <p className="text-slate-600 mt-2">
            Sign in to access your PG management dashboard.
          </p>
        </div>

        {/* Login Form */}
        <div className="border rounded-2xl p-8 bg-white">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Forgot Password?
                </Link>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-slate-900"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
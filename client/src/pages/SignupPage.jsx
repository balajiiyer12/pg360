import { Link } from "react-router-dom";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">PG360</h1>
          <p className="text-slate-600 mt-2">
            Create your account to manage your PG efficiently.
          </p>
        </div>

        {/* Signup Form */}
        <div className="border rounded-2xl p-8 bg-white">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

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
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-slate-900 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";

function HostelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
      <LoggedInNavbar />

      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Akhil PG
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage rooms and tenants for this property.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">Total Rooms</p>
            <h2 className="text-3xl font-bold mt-2">24</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">Occupied Rooms</p>
            <h2 className="text-3xl font-bold mt-2">18</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <p className="text-sm text-slate-500">Tenants</p>
            <h2 className="text-3xl font-bold mt-2">42</h2>
          </div>
        </div>

        {/* Rooms Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Manage Rooms
              </h2>
              <p className="text-sm text-slate-500">
                Create, update and remove rooms.
              </p>
            </div>

            <button className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold">
              + Add Room
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Room 101
                  </h3>

                  <div className="flex gap-3 mt-2 text-sm text-slate-500">
                    <span>Capacity: 4</span>
                    <span>Occupied: 3</span>
                    <span>Available</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium">
                    View
                  </button>

                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium">
                    Edit
                  </button>

                  <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Room 102
                  </h3>

                  <div className="flex gap-3 mt-2 text-sm text-slate-500">
                    <span>Capacity: 2</span>
                    <span>Occupied: 2</span>
                    <span>Full</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium">
                    View
                  </button>

                  <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium">
                    Edit
                  </button>

                  <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tenants Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Manage Tenants
              </h2>
              <p className="text-sm text-slate-500">
                Track residents and their room allocations.
              </p>
            </div>

            <button className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold">
              + Add Tenant
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Rahul Sharma
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Room 101
                  </p>

                  <p className="text-sm text-slate-500">
                    +91 9876543210
                  </p>
                </div>

                <div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button className="flex-1 border border-slate-300 py-2 rounded-lg text-sm font-medium">
                  View
                </button>

                <button className="flex-1 border border-slate-300 py-2 rounded-lg text-sm font-medium">
                  Edit
                </button>

                <button className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Amit Verma
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Room 102
                  </p>

                  <p className="text-sm text-slate-500">
                    +91 9123456780
                  </p>
                </div>

                <div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button className="flex-1 border border-slate-300 py-2 rounded-lg text-sm font-medium">
                  View
                </button>

                <button className="flex-1 border border-slate-300 py-2 rounded-lg text-sm font-medium">
                  Edit
                </button>

                <button className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HostelPage;
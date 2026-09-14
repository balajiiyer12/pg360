import Footer from "../components/Footer";
import LoggedInNavbar from "../components/LoggedInNavbar";

function AdminDashboard() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
            <LoggedInNavbar/>
            
            <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Welcome, Balaji
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage hostels, tenants, complaints and monitor platform activity.
                    </p>
                </div>

                {/* Metrics*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Card 1: Total Hostels */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Hostels</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
                    </div>

                    {/* Card 2: Total Tenants */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Tenants</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">1</p>
                    </div>

                    {/* Card 3: Open Complaints */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Open Complaints</p>
                        <p className="text-3xl font-bold text-amber-600 mt-2">1</p>
                    </div>

                    {/* Card 4: Occupancy */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Occupancy</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">25%</p>
                    </div>
                </div>

                {/* Admin Profile Section */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Profile</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div>
                            <p className="text-xs font-medium text-slate-400">Name</p>
                            <p className="text-sm font-medium text-slate-900 mt-0.5">Balaji</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400">Email</p>
                            <p className="text-sm font-medium text-slate-900 mt-0.5">balaji@gmail.com</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-400 mb-1">Account Role</p>
                            <span className="  px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white">
                                ADMIN
                            </span>
                        </div>
                    </div>
                </div>

                {/* Management Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Manage Hostels Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">Manage Hostels</h3>
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                    1 Properties
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">
                                Register new hostels, manage rooms, pricing, and view tenant assignments.
                            </p>
                        </div>
                        <button className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            Open Hostel Management
                        </button>
                    </div>

                    {/* Manage Complaints Card */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-slate-900">Manage Complaints</h3>
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                    1 Pending
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mb-6">
                                Review, resolve, and monitor tenant issues across all your properties.
                            </p>
                        </div>
                        <button className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
                            Open Complaint Desk
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default AdminDashboard;
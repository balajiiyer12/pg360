import React from 'react';
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/LoggedInNavbar";

function HostelPage() {
    // Dummy data
    const hostel = {
        hostelName: "Sunrise Executive Hostel",
        description: "Premium student and working professional accommodation"
    };
    const hostelid = "HOS-9482";

    const rooms = [
        { roomId: 'r1', roomName: '101', capacity: 2, rent: 6000 },
        { roomId: 'r2', roomName: '102', capacity: 3, rent: 5000 },
        { roomId: 'r3', roomName: '201', capacity: 1, rent: 8500 }
    ];

    const tenants = [
        { id: 't1', name: 'Aarav Sharma', email: 'aarav@gmail.com', roomName: '101' },
        { id: 't2', name: 'Rohan Verma', email: 'rohan@gmail.com', roomName: '102' },
        { id: 't3', name: 'Priya Patel', email: 'priya@gmail.com', roomName: 'Unassigned' }
    ];

    const totalRooms = rooms.length;
    const totalBedCapacity = rooms.reduce((acc, room) => acc + room.capacity, 0);
    const enrolledTenants = tenants.filter(t => t.roomName !== 'Unassigned').length;
    const occupancyRate = totalBedCapacity > 0 ? Math.round((enrolledTenants / totalBedCapacity) * 100) + "%" : "0%";

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans relative">
            <LoggedInNavbar />
            
            <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{hostel.hostelName}</h1>
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md tracking-wide">
                                ID: {hostelid}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">{hostel.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer">
                            + Add Room
                        </button>
                        <button className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                            + Add Tenant
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                        <p className="text-xs font-medium text-slate-500">Total Rooms</p>
                        <p className="text-3xl font-bold text-slate-900">{totalRooms}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                        <p className="text-xs font-medium text-slate-500">Total Bed Capacity</p>
                        <p className="text-3xl font-bold text-slate-900">{totalBedCapacity}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                        <p className="text-xs font-medium text-slate-500">Enrolled Tenants</p>
                        <p className="text-3xl font-bold text-slate-900">{enrolledTenants}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                        <p className="text-xs font-medium text-slate-500">Occupancy Rate</p>
                        <p className="text-3xl font-bold text-emerald-600">{occupancyRate}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Rooms</h2>
                                <p className="text-xs text-slate-500">Rooms available in this hostel</p>
                            </div>
                            <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                                + Add Room
                            </button>
                        </div>

                        {rooms.map((room) => (
                            <div key={room.roomId} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900">{room.roomName}</span>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                                            Cap: {room.capacity} Beds
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-emerald-600">₹{room.rent} / month</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">All Tenants</h2>
                                <p className="text-xs text-slate-500">All tenants registered in this hostel</p>
                            </div>
                            <button className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                                + Add Tenant
                            </button>
                        </div>

                        {tenants.map((tenant) => (
                            <div key={tenant.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900">{tenant.name}</span>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                                            Room: {tenant.roomName}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">{tenant.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default HostelPage;
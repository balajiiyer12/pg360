import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/LoggedInNavbar";

function AdminComplaintPage() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'pending', 'resolved'

    const handleDelete = async (complaintId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8080/api/complaints/admin/${complaintId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });
            // Remove the deleted complaint from local state
            setComplaints(prev => prev.filter(c => c.complaintId !== complaintId));
        } catch (err) {
            console.error("Failed to delete complaint:", err);
            alert(err.response?.data?.message || "Failed to delete complaint");
        }
    };

    const updateStatus = async (complaintId, newStatus) => {
        try {
            console.log(complaintId);
            const token = localStorage.getItem("token");
            await axios.patch(`http://localhost:8080/api/complaints/admin/${complaintId}`, 
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );
            // Update the status of the complaint in local state
            setComplaints(prev => prev.map(c => 
                c.complaintId === complaintId ? { ...c, status: newStatus } : c
            ));
        } catch (err) {
            console.error("Failed to update complaint status:", err);
            alert(err.response?.data?.message || "Failed to update status");
        }
    };
    
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:8080/api/complaints/admin", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                setComplaints(response.data.allComplaints || response.data);
            } catch (err) {
                console.error("Failed to fetch admin complaints:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    // Derived metrics
    const totalCount = complaints.length;
    const pendingCount = complaints.filter(c => c.status === 'pending').length;
    const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

    // Filtered list
    const filteredComplaints = complaints.filter(c => {
        if (filter === 'pending') return c.status === 'pending';
        if (filter === 'resolved') return c.status === 'resolved';
        return true;
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
            <LoggedInNavbar />
            
            <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Manage Complaints
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Review, track and resolve maintenance requests and issues reported by tenants.
                    </p>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Complaints</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            {loading ? "..." : totalCount}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending</p>
                        <p className="text-3xl font-bold text-amber-600 mt-2">
                            {loading ? "..." : pendingCount}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Resolved</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">
                            {loading ? "..." : resolvedCount}
                        </p>
                    </div>
                </div>

                {/* Filter Tabs & Ticket Counter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer ${
                                filter === 'all' 
                                    ? 'bg-slate-900 text-white' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                                filter === 'pending' 
                                    ? 'bg-slate-900 text-white' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Pending
                        </button>
                        <button 
                            onClick={() => setFilter('resolved')}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                                filter === 'resolved' 
                                    ? 'bg-slate-900 text-white' 
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Resolved
                        </button>
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                        Showing {filteredComplaints.length} of {totalCount} tickets
                    </p>
                </div>

                {/* Complaints List Container */}
                {loading ? (
                    <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
                        Loading complaints...
                    </div>
                ) : filteredComplaints.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
                        No complaints found.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredComplaints.map((complaint) => (
                            <div key={complaint.complaintId} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-lg font-bold text-slate-900">{complaint.title}</h2>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                                complaint.status === 'resolved' 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600">{complaint.description}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {complaint.status !== 'resolved' ? (
                                            <button 
                                                onClick={() => updateStatus(complaint.complaintId, 'resolved')}
                                                className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <span>✓</span> Mark Resolved
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => updateStatus(complaint.complaintId, 'pending')}
                                                className="px-4 py-2 text-sm font-semibold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                                            >
                                                Mark Pending
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(complaint.complaintId)}
                                            className="px-4 py-2 text-sm font-semibold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                                        >
                                            Delete Ticket
                                        </button>
                                    </div>
                                </div>

                                {/* Metadata Box */}
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Tenant:</p>
                                        <p className="text-sm font-medium text-slate-900 mt-0.5">{complaint.tenantName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Email:</p>
                                        <p className="text-sm font-medium text-slate-900 mt-0.5">{complaint.tenantEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Hostel / Room:</p>
                                        <p className="text-sm font-medium text-slate-900 mt-0.5">
                                            {complaint.hostelName} ({complaint.roomName})
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">Date Reported:</p>
                                        <p className="text-sm font-medium text-slate-900 mt-0.5">
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default AdminComplaintPage;
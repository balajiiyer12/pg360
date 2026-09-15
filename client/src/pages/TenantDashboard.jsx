import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/LoggedInNavbar.jsx"

export default function TenantDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Extract details safely from Auth context user object
    const room = user?.room || {};
    const hostelName = user?.hostelName || "My Hostel";
    const rentAmount = room?.rent || 0;

    // Payment state
    const [paymentStatus, setPaymentStatus] = useState("Pending");
    const [payingRent, setPayingRent] = useState(false);

    // Complaints state & modals
    const [complaints, setComplaints] = useState([]);
    const [loadingComplaints, setLoadingComplaints] = useState(true);
    const [error, setError] = useState(null);

    // Raise complaint state
    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Fetch tenant complaints on mount
    const fetchComplaints = async () => {
        try {
            setLoadingComplaints(true);
            const response = await fetch('http://localhost:8080/api/complaints/tenant', {
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch complaints");
            setComplaints(data.myComplaints || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingComplaints(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    // Handle Direct Payment Submission
    const handleDirectPayment = async () => {
            setPayingRent(true);
            alert(`Payment of ₹${rentAmount.toLocaleString()} completed successfully!`);
            setPaymentStatus("Paid");
            setPayingRent(false);
    };

    // Handle creating a complaint
    const handleCreateComplaint = async (e) => {
        e.preventDefault();
        if (!title || !description) return;

        try {
            setSubmitting(true);
            const response = await fetch('http://localhost:8080/api/complaints/tenant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to create complaint");

            setTitle('');
            setDescription('');
            setShowComplaintModal(false);
            fetchComplaints();
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle deleting a complaint
    const handleDeleteComplaint = async (complaintId) => {
        if (!window.confirm("Are you sure you want to delete this complaint?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/complaints/tenant/${complaintId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to delete complaint");

            fetchComplaints();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
            <div>
               <LoggedInNavbar></LoggedInNavbar>

               {/* Main Content */}
               <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
                   {/* Welcome Header */}
                   <div className="space-y-1">
                       <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                           Welcome, {user?.name || "Tenant"}
                       </h1>
                       <p className="text-sm text-slate-500">
                           Resident at {hostelName}
                       </p>
                   </div>

                   {error && (
                       <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                           {error}
                       </div>
                   )}

                   {/* Top Metrics Row */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                           <p className="text-xs font-medium text-slate-500">Assigned Room</p>
                           <div>
                               <p className="text-3xl font-bold text-slate-900">{room?.roomName}</p>
                               <p className="text-xs text-slate-500 mt-1">{hostelName}</p>
                           </div>
                       </div>

                       <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                           <p className="text-xs font-medium text-slate-500">Monthly Rent</p>
                           <div>
                               <p className="text-3xl font-bold text-slate-900">₹{rentAmount.toLocaleString()}</p>
                               <p className="text-xs text-slate-500 mt-1">Due on 1st of every month</p>
                           </div>
                       </div>

                       <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                           <p className="text-xs font-medium text-slate-500">Rent Status (This Month)</p>
                           <div className="pt-2">
                               <span className={`px-3 py-1 text-xs font-semibold rounded-full tracking-wide ${
                                   paymentStatus.toLowerCase() === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                               }`}>
                                   {paymentStatus}
                               </span>
                           </div>
                       </div>
                   </div>

                   {/* Rent Payment Section */}
                   <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                       <div className="space-y-1">
                           <h2 className="text-lg font-bold text-slate-900">Rent Payment</h2>
                           <p className="text-sm text-slate-500">
                               Amount Due: ₹{rentAmount.toLocaleString()} for the current billing cycle.
                           </p>
                       </div>
                       <div>
                           <button 
                               onClick={handleDirectPayment}
                               disabled={paymentStatus.toLowerCase() === 'paid' || payingRent}
                               className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                           >
                               {payingRent ? "Processing..." : paymentStatus.toLowerCase() === 'paid' ? 'Rent Already Paid' : 'Pay Rent Now'}
                           </button>
                       </div>
                   </div>

                   {/* Bottom Row: Profile & Helpdesk */}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       {/* Tenant Profile Card */}
                       <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                           <h2 className="text-lg font-bold text-slate-900">Tenant Profile</h2>
                           <div className="divide-y divide-slate-100 text-sm">
                               <div className="flex justify-between py-3">
                                   <span className="text-slate-500">Name</span>
                                   <span className="font-semibold text-slate-900">{user?.name || "-"}</span>
                               </div>
                               <div className="flex justify-between py-3">
                                   <span className="text-slate-500">Email</span>
                                   <span className="font-semibold text-slate-900">{user?.email || "-"}</span>
                               </div>
                               <div className="flex justify-between py-3">
                                   <span className="text-slate-500">Hostel</span>
                                   <span className="font-semibold text-slate-900">{hostelName}</span>
                               </div>
                               <div className="flex justify-between py-3">
                                   <span className="text-slate-500">Room</span>
                                   <span className="font-semibold text-slate-900">{room?.roomNumber || room?.number || "-"}</span>
                               </div>
                           </div>
                       </div>

                       {/* Helpdesk & Complaints Card */}
                       <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
                           <div className="space-y-2">
                               <h2 className="text-lg font-bold text-slate-900">Helpdesk & Complaints</h2>
                               <p className="text-sm text-slate-500 leading-relaxed">
                                   Have a maintenance request or facing an issue with electricity, plumbing, or WiFi in your room?
                               </p>
                           </div>
                           <div>
                               <button 
                                   onClick={() => setShowComplaintModal(true)}
                                   className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                               >
                                   Raise or Track Complaint &rarr;
                               </button>
                           </div>
                       </div>
                   </div>

                   {/* Complaints List Section */}
                   <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                       <div className="flex items-center justify-between">
                           <div>
                               <h2 className="text-lg font-bold text-slate-900">Your Complaints History</h2>
                               <p className="text-xs text-slate-500">Track status of maintenance and room tickets</p>
                           </div>
                           <button 
                               onClick={() => setShowComplaintModal(true)}
                               className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                           >
                               + Raise Complaint
                           </button>
                       </div>

                       {loadingComplaints ? (
                           <p className="text-sm text-slate-400 text-center py-6">Loading complaints...</p>
                       ) : complaints.length === 0 ? (
                           <p className="text-sm text-slate-400 text-center py-6">No complaints registered yet.</p>
                       ) : (
                           <div className="space-y-3">
                               {complaints.map((c) => {
                                   const cId = c.complaintId || c._id;
                                   return (
                                       <div key={cId} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                           <div className="space-y-1">
                                               <div className="flex items-center gap-2">
                                                   <span className="font-bold text-slate-900">{c.title}</span>
                                                   <span className={`px-2 py-0.5 text-xs font-semibold rounded-md uppercase ${c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                       {c.status || 'Pending'}
                                                   </span>
                                               </div>
                                               <p className="text-sm text-slate-600">{c.description}</p>
                                               <p className="text-xs text-slate-400">Created: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}</p>
                                           </div>
                                           <div className="flex items-center gap-2">
                                               <button 
                                                   onClick={() => handleDeleteComplaint(cId)}
                                                   className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
                                               >
                                                   Delete
                                               </button>
                                           </div>
                                       </div>
                                   );
                               })}
                           </div>
                       )}
                   </div>
               </main>
            </div>

            {/* Raise Complaint Modal */}
            {showComplaintModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">Raise New Complaint</h3>
                            <button 
                                onClick={() => setShowComplaintModal(false)}
                                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateComplaint} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600">Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Leaking Tap in Bathroom" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600">Description</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="Describe the issue in detail..." 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setShowComplaintModal(false)}
                                    className="px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                                >
                                    {submitting ? "Submitting..." : "Submit Complaint"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
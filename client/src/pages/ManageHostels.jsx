import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/LoggedInNavbar";
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../config";

function ManageHostels() {
    const navigate = useNavigate();
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    
    const [newHostel, setNewHostel] = useState({ name: '', description: '' });
    const [editingHostel, setEditingHostel] = useState({ hostelId: '', name: '', description: '' });

    useEffect(() => {
        const fetchHostels = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/admin/hostel`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                
                const fetchedHostels = response.data.allHostels || response.data;
                setHostels(Array.isArray(fetchedHostels) ? fetchedHostels : []);
            } catch (err) {
                console.error("Failed to fetch hostels:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHostels();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!newHostel.name || !newHostel.description) return;
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/admin/hostel`, 
                { name: newHostel.name, description: newHostel.description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            const createdHostel = response.data.newHostel || response.data;
            setHostels([...hostels, createdHostel]);
            setNewHostel({ name: '', description: '' });
            setShowRegisterModal(false);
        } catch (err) {
            console.error("Failed to create hostel:", err);
            alert(err.response?.data?.message || "Failed to register hostel");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingHostel.name || !editingHostel.description) return;

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`${API_URL}/admin/hostel/${editingHostel.hostelId}`, 
                { name: editingHostel.name, description: editingHostel.description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                }
            );

            const updated = response.data.updatedHostel || response.data;
            
            // Update state with the edited hostel values
            setHostels(hostels.map(h => h.hostelId === editingHostel.hostelId ? { ...h, ...updated } : h));
            setShowEditModal(false);
            setEditingHostel({ hostelId: '', name: '', description: '' });
        } catch (err) {
            console.error("Failed to update hostel:", err);
            alert(err.response?.data?.message || "Failed to update hostel");
        }
    };

    const handleDelete = async (hostelId) => {
        if (window.confirm("Are you sure you want to delete this hostel?")) {
            try {
                const token = localStorage.getItem("token");
                await axios.delete(`${API_URL}/admin/hostel/${hostelId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });
                setHostels(hostels.filter(h => h.hostelId !== hostelId));
            } catch (err) {
                console.error("Failed to delete hostel:", err);
                alert(err.response?.data?.message || "Failed to delete hostel");
            }
        }
    };

    const handleCardClick = (hostelId) => {
        navigate(`${hostelId}`);
    };

    const openEditModal = (hostel) => {
        setEditingHostel({
            hostelId: hostel.hostelId,
            name: hostel.name,
            description: hostel.description
        });
        setShowEditModal(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans">
            <LoggedInNavbar />
            
            <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Manage Hostels
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Register new properties, update details, or view specific hostel insights.
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowRegisterModal(true)}
                        className="px-4 py-2.5 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
                    >
                        + Register New Hostel
                    </button>
                </div>

                {/* Hostels Grid */}
                {loading ? (
                    <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
                        Loading hostels...
                    </div>
                ) : hostels.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl border border-slate-200 text-center text-slate-500">
                        No hostels registered yet. Click the button above to add one.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hostels.map((hostel) => (
                            <div 
                                key={hostel.hostelId} 
                                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
                            >
                                <div 
                                    className="p-6 cursor-pointer space-y-3"
                                    onClick={() => handleCardClick(hostel.hostelId)}
                                >
                                    <h2 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                                        {hostel.name}
                                    </h2>
                                    <p className="text-sm text-slate-600 line-clamp-3">{hostel.description}</p>
                                </div>

                                <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openEditModal(hostel);
                                        }}
                                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                                    >
                                        Edit Details
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(hostel.hostelId);
                                        }}
                                        className="text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Register Modal */}
                {showRegisterModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">Register New Hostel</h3>
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Hostel Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newHostel.name}
                                        onChange={(e) => setNewHostel({...newHostel, name: e.target.value})}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        placeholder="e.g. Royal Boys Stay"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                                    <textarea 
                                        rows="3"
                                        required
                                        value={newHostel.description}
                                        onChange={(e) => setNewHostel({...newHostel, description: e.target.value})}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        placeholder="Brief details about facilities..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setShowRegisterModal(false)}
                                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                                    >
                                        Save Hostel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">Edit Hostel Details</h3>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Hostel Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={editingHostel.name}
                                        onChange={(e) => setEditingHostel({...editingHostel, name: e.target.value})}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                                    <textarea 
                                        rows="3"
                                        required
                                        value={editingHostel.description}
                                        onChange={(e) => setEditingHostel({...editingHostel, description: e.target.value})}
                                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                                    >
                                        Update Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default ManageHostels;
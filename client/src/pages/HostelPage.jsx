import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/LoggedInNavbar";
import RoomModal from "../components/RoomModal";
import axios from "axios";
import { API_URL } from "../config";

function HostelPage() {
    const { hostelid } = useParams();
    const token = localStorage.getItem("token");

    const axiosConfig = {
        withCredentials: true,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    const [hostel, setHostel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Room Modal & Form States
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [roomForm, setRoomForm] = useState({ roomName: '', capacity: '', rent: '' });
    const [submitting, setSubmitting] = useState(false);

    // Tenant Modal & Form States
    const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
    const [tenantModalMode, setTenantModalMode] = useState('add');
    const [currentTenantId, setCurrentTenantId] = useState(null);
    const [tenantForm, setTenantForm] = useState({ name: '', email: '', password: '', roomId: '' });
    const [submittingTenant, setSubmittingTenant] = useState(false);

    
        useEffect(() => {
    const fetchHostelData = async () => {
        try {
            setLoading(true);

            const [hostelRes, roomsRes, tenantsRes] = await Promise.all([
                axios.get(
                    `${API_URL}/admin/hostel/${hostelid}`,
                    axiosConfig
                ),
                axios.get(
                    `${API_URL}/admin/hostel/${hostelid}/room`,
                    axiosConfig
                ),
                axios.get(
                    `${API_URL}/admin/users/hostel/${hostelid}`,
                    axiosConfig
                ),
            ]);

            setHostel(hostelRes.data.hostel || hostelRes.data);
            setRooms(roomsRes.data.allRooms || []);
            setTenants(tenantsRes.data.tenants || []);
        } catch (err) {
            setError(
                err.response?.data?.message || err.message
            );
        } finally {
            setLoading(false);
        }
    };

    if (hostelid) fetchHostelData();
}, [hostelid]);

    // Room Handlers
    const handleOpenAddModal = () => {
        setModalMode('add');
        setRoomForm({ roomName: '', capacity: '', rent: '' });
        setCurrentRoomId(null);
        setIsRoomModalOpen(true);
    };

    const handleOpenEditModal = (room) => {
        setModalMode('edit');
        setRoomForm({ roomName: room.roomName, capacity: room.capacity, rent: room.rent });
        setCurrentRoomId(room.roomId);
        setIsRoomModalOpen(true);
    };

const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
        let data;

        if (modalMode === "add") {
            const response = await axios.post(
                `${API_URL}/admin/hostel/${hostelid}/room`,
                roomForm,
                axiosConfig
            );
            data = response.data;
        } else {
            const response = await axios.put(
                `${API_URL}/admin/hostel/rooms/${currentRoomId}`,
                roomForm,
                axiosConfig
            );
            data = response.data;
        }

        if (modalMode === "add") {
            setRooms([...rooms, data.newRoom]);
        } else {
            setRooms(
                rooms.map((r) =>
                    r.roomId === currentRoomId
                        ? data.updatedRoom
                        : r
                )
            );
        }

        setIsRoomModalOpen(false);
    } catch (err) {
        alert(
            err.response?.data?.message ||
                err.message
        );
    } finally {
        setSubmitting(false);
    }
};

    const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?"))
        return;

    try {
        await axios.delete(
            `${API_URL}/admin/hostel/rooms/${roomId}`,
            axiosConfig
        );

        setRooms(
            rooms.filter((r) => r.roomId !== roomId)
        );
    } catch (err) {
        alert(
            err.response?.data?.message ||
                err.message
        );
    }
};

    // Tenant Handlers
    const handleOpenAddTenantModal = () => {
        setTenantModalMode('add');
        setTenantForm({ name: '', email: '', password: '', roomId: '' });
        setCurrentTenantId(null);
        setIsTenantModalOpen(true);
    };

    const handleOpenEditTenantModal = (tenant) => {
        setTenantModalMode('edit');
        setTenantForm({ 
            name: tenant.name, 
            email: tenant.email, 
            password: '', // leave blank unless changing
            roomId: tenant.roomId || '' 
        });
        setCurrentTenantId(tenant.id);
        setIsTenantModalOpen(true);
    };

    
    const handleTenantSubmit = async (e) => {
    e.preventDefault();
    setSubmittingTenant(true);

    try {
        const payload = {
            ...tenantForm,
            hostelId: hostelid,
        };

        if (
            tenantModalMode === "edit" &&
            !payload.password
        ) {
            delete payload.password;
        }

        let data;

        if (tenantModalMode === "add") {
            const response = await axios.post(
                `${API_URL}/admin/users`,
                payload,
                axiosConfig
            );

            data = response.data;
        } else {
            const response = await axios.put(
                `${API_URL}/admin/users/${currentTenantId}`,
                payload,
                axiosConfig
            );

            data = response.data;
        }

        const savedUser =
            data.newUser || data.updatedUser;

        const assignedRoom = rooms.find(
            (r) => r.roomId === savedUser.roomId
        );

        const enrichedTenant = {
            ...savedUser,
            roomName: assignedRoom
                ? assignedRoom.roomName
                : "Unassigned",
        };

        if (tenantModalMode === "add") {
            setTenants([
                ...tenants,
                enrichedTenant,
            ]);
        } else {
            setTenants(
                tenants.map((t) =>
                    t.id === currentTenantId
                        ? enrichedTenant
                        : t
                )
            );
        }

        setIsTenantModalOpen(false);
    } catch (err) {
        alert(
            err.response?.data?.message ||
                err.message
        );
    } finally {
        setSubmittingTenant(false);
    }
};

    const handleDeleteTenant = async (tenantId) => {
    if (
        !window.confirm(
            "Are you sure you want to delete this tenant?"
        )
    )
        return;

    try {
        await axios.delete(
            `${API_URL}/admin/users/${tenantId}`,
            axiosConfig
        );

        setTenants(
            tenants.filter((t) => t.id !== tenantId)
        );
    } catch (err) {
        alert(
            err.response?.data?.message ||
                err.message
        );
    }
};

    const totalRooms = rooms.length;
    const totalBedCapacity = rooms.reduce((acc, room) => acc + Number(room.capacity || 0), 0);
    const enrolledTenants = tenants.length;
    const occupancyRate = totalBedCapacity > 0 ? Math.round((enrolledTenants / totalBedCapacity) * 100) + "%" : "0%";

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
                <LoggedInNavbar />
                <div className="grow flex items-center justify-center">
                    <p className="text-slate-500 font-medium">Loading hostel details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
                <LoggedInNavbar />
                <div className="grow flex items-center justify-center">
                    <p className="text-red-500 font-medium">Error: {error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans relative">
            <LoggedInNavbar />
            
            <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-slate-900">{hostel?.name}</h1>
                        <p className="text-sm text-slate-500">{hostel?.description || "Hostel management dashboard"}</p>
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
                    {/* Rooms Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Rooms</h2>
                                <p className="text-xs text-slate-500">Rooms available in this hostel</p>
                            </div>
                            <button 
                                onClick={handleOpenAddModal}
                                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                + Add Room
                            </button>
                        </div>

                        {rooms.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-6">No rooms added yet.</p>
                        ) : (
                            rooms.map((room) => (
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
                                        <button 
                                            onClick={() => handleOpenEditModal(room)}
                                            className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteRoom(room.roomId)}
                                            className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Tenants Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">All Tenants</h2>
                                <p className="text-xs text-slate-500">All tenants registered in this hostel</p>
                            </div>
                            <button 
                                onClick={handleOpenAddTenantModal}
                                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                + Add Tenant
                            </button>
                        </div>

                        {tenants.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-6">No tenants registered yet.</p>
                        ) : (
                            tenants.map((tenant) => (
                                <div key={tenant.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">{tenant.name}</span>
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                                                Room: {tenant.roomName || "Unassigned"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500">{tenant.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleOpenEditTenantModal(tenant)}
                                            className="px-3 py-1 text-xs font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteTenant(tenant.id)}
                                            className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            <RoomModal 
                isOpen={isRoomModalOpen}
                onClose={() => setIsRoomModalOpen(false)}
                onSubmit={handleRoomSubmit}
                modalMode={modalMode}
                roomForm={roomForm}
                setRoomForm={setRoomForm}
                submitting={submitting}
            />

            {/* Tenant Modal */}
            {isTenantModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">
                                {tenantModalMode === 'add' ? 'Add New Tenant' : 'Edit Tenant'}
                            </h3>
                            <button 
                                onClick={() => setIsTenantModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <form onSubmit={handleTenantSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600">Full Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., John Doe" 
                                    value={tenantForm.name}
                                    onChange={(e) => setTenantForm({...tenantForm, name: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600">Email Address</label>
                                <input 
                                    type="email_address" 
                                    placeholder="e.g., john@example.com" 
                                    value={tenantForm.email}
                                    onChange={(e) => setTenantForm({...tenantForm, email: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600">
                                    Password {tenantModalMode === 'edit' && '(Leave blank to keep unchanged)'}
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    value={tenantForm.password}
                                    onChange={(e) => setTenantForm({...tenantForm, password: e.target.value})}
                                    {...(tenantModalMode === 'add' ? { required: true } : {})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600">Assign Room</label>
                                <select 
                                    value={tenantForm.roomId}
                                    onChange={(e) => setTenantForm({...tenantForm, roomId: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
                                >
                                    <option value="">-- Unassigned --</option>
                                    {rooms.map((room) => (
                                        <option key={room.roomId} value={room.roomId}>
                                            {room.roomName} (Cap: {room.capacity})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsTenantModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submittingTenant}
                                    className="px-4 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer disabled:opacity-50"
                                >
                                    {submittingTenant ? "Saving..." : tenantModalMode === 'add' ? "Add Tenant" : "Save Changes"}
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

export default HostelPage;
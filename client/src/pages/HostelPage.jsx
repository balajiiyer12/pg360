import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from "../components/Footer";
import LoggedInNavbar from "../components/LoggedInNavbar";
import RoomModal from "../components/RoomModal";

function HostelPage() {
    const { hostelid } = useParams();

    const [hostel, setHostel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal & Form States
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [roomForm, setRoomForm] = useState({ roomName: '', capacity: '', rent: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchHostelData = async () => {
            try {
                setLoading(true);
                const [hostelRes, roomsRes, tenantsRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/admin/hostel/${hostelid}`, { credentials: 'include' }),
                    fetch(`http://localhost:8080/api/admin/hostel/${hostelid}/room`, { credentials: 'include' }),
                    fetch(`http://localhost:8080/api/admin/users/hostel/${hostelid}`, { credentials: 'include' })
                ]);

                const hostelData = await hostelRes.json();
                const roomsData = await roomsRes.json();
                const tenantsData = await tenantsRes.json();

                if (!hostelRes.ok) throw new Error(hostelData.message || "Failed to fetch hostel details");
                if (!roomsRes.ok) throw new Error(roomsData.message || "Failed to fetch rooms");
                if (!tenantsRes.ok) throw new Error(tenantsData.message || "Failed to fetch tenants");

                setHostel(hostelData.hostel || hostelData);
                setRooms(roomsData.allRooms || []);
                setTenants(tenantsData.tenants || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (hostelid) fetchHostelData();
    }, [hostelid]);

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
            const url = modalMode === 'add' 
                ? `http://localhost:8080/api/admin/hostel/${hostelid}/room`
                : `http://localhost:8080/api/admin/hostel/rooms/${currentRoomId}`;
            
            const method = modalMode === 'add' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(roomForm)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to save room");

            if (modalMode === 'add') {
                setRooms([...rooms, data.newRoom]);
            } else {
                setRooms(rooms.map(r => r.roomId === currentRoomId ? data.updatedRoom : r));
            }

            setIsRoomModalOpen(false);
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/admin/hostel/rooms/${roomId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to delete room");

            setRooms(rooms.filter(r => r.roomId !== roomId));
        } catch (err) {
            alert(`Error: ${err.message}`);
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

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">All Tenants</h2>
                                <p className="text-xs text-slate-500">All tenants registered in this hostel</p>
                            </div>
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

            <Footer />
        </div>
    );
}

export default HostelPage;
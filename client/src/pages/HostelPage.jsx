import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";

function HostelPage() {
  const { hostelid } = useParams();
  const token = localStorage.getItem("token");
  
  const [rooms, setRooms] = useState([]);
  const [hostel, setHostel] = useState(null);
  const [tenants, setTenants] = useState([]);
  
  // Room Modals & Data States
  const [newRoomData, setNewRoomData] = useState({ roomName: "", capacity: "", rent: "" });
  const [editRoomData, setEditRoomData] = useState({ roomId: "", roomName: "", capacity: "", rent: "" });
  const [registerRoomModal, setRegisterRoomModal] = useState(false);
  const [updateRoomModal, setUpdateRoomModal] = useState(false);

  // Tenant Modals & Data States (Phone removed)
  const [newTenantData, setNewTenantData] = useState({ name: "", email: "", roomId: "" });
  const [editTenantData, setEditTenantData] = useState({ userId: "", name: "", email: "", roomId: "" });
  const [registerTenantModal, setRegisterTenantModal] = useState(false);
  const [updateTenantModal, setUpdateTenantModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching data for hostelid:", hostelid);
        
        const roomsRes = await axios.get(`${API_URL}/admin/hostel/${hostelid}/room`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const hostelRes = await axios.get(`${API_URL}/admin/hostel/${hostelid}`, { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const tenantsRes = await axios.get(`${API_URL}/admin/users/hostel/${hostelid}`, { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setRooms(roomsRes?.data?.allRooms || []);
        setHostel(hostelRes?.data?.hostel);
        setTenants(tenantsRes?.data?.tenants || []);
      } catch (error) {
        console.error("Failed to fetch hostel stats details:", error.response?.data || error.message);
      }
    };

    if (hostelid && token) {
      fetchStats();
    }
  }, [hostelid, token]);

  // Direct Calculations for Stats
  const totalRooms = rooms.length;
  const totalTenants = tenants.length;
  
  const totalCapacity = rooms.reduce(
    (sum, room) => sum + Number(room.capacity || 0),
    0
  );

  const occupancy =
    totalCapacity > 0
      ? `${Math.round((totalTenants / totalCapacity) * 100)}%`
      : "0%";

  // --- ROOM HANDLERS ---
  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditRoomInputChange = (e) => {
    const { name, value } = e.target;
    setEditRoomData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleRegisterRoom(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/admin/hostel/${hostelid}/room`,
        newRoomData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const createdRoom = response?.data?.newRoom || response?.data?.room;
      if (createdRoom) {
        setRooms((prevRooms) => [...prevRooms, createdRoom]);
      }

      setNewRoomData({ roomName: "", capacity: "", rent: "" });
      setRegisterRoomModal(false);
    } catch (error) {
      console.error("Failed to add room:", error.response?.data || error.message);
    }
  }

  function handleOpenUpdateRoomModal(room) {
    setEditRoomData({
      roomId: room.roomId,
      roomName: room.roomName,
      capacity: room.capacity,
      rent: room.rent,
    });
    setUpdateRoomModal(true);
  }

  async function handleUpdateRoomSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/admin/hostel/rooms/${editRoomData.roomId}`,
        {
          roomName: editRoomData.roomName,
          capacity: editRoomData.capacity,
          rent: editRoomData.rent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const updated = response?.data?.updatedRoom;
      if (updated) {
        setRooms((prevRooms) =>
          prevRooms.map((r) => (r.roomId === updated.roomId ? updated : r))
        );
      }

      setUpdateRoomModal(false);
    } catch (error) {
      console.error("Failed to update room:", error.response?.data || error.message);
    }
  }

  async function handleDeleteRoom(roomid) {
    const isConfirmed = window.confirm("Are you sure you want to delete this room? This action cannot be undone.");
    if (!isConfirmed) return;

    try {
      const response = await axios.delete(`${API_URL}/admin/hostel/rooms/${roomid}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const deletedRoomId = response?.data?.deletedRoom?.roomId || roomid;
      setRooms(rooms.filter((room) => room.roomId !== deletedRoomId));
    } catch (error) {
      console.error("Failed to delete room:", error.response?.data || error.message);
    }
  }

  // --- TENANT HANDLERS ---
  const handleTenantInputChange = (e) => {
    const { name, value } = e.target;
    setNewTenantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditTenantInputChange = (e) => {
    const { name, value } = e.target;
    setEditTenantData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleRegisterTenant(e) {
    e.preventDefault();
    try {
      // If roomId is empty string, we can send null or empty depending on backend schema
      const payload = { 
        ...newTenantData, 
        hostelId: hostelid, 
        roomId: newTenantData.roomId === "" ? null : newTenantData.roomId 
      };

      const response = await axios.post(
        `${API_URL}/admin/users`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const createdTenant = response?.data?.user || response?.data?.tenant || response?.data?.newUser;
      if (createdTenant) {
        setTenants((prev) => [...prev, createdTenant]);
      } else {
        window.location.reload(); 
      }

      setNewTenantData({ name: "", email: "", roomId: "" });
      setRegisterTenantModal(false);
    } catch (error) {
      console.error("Failed to add tenant:", error.response?.data || error.message);
    }
  }

  function handleOpenUpdateTenantModal(tenant) {
    setEditTenantData({
      userId: tenant.userId || tenant.id,
      name: tenant.name || tenant.username || "",
      email: tenant.email || "",
      roomId: tenant.roomId || "",
    });
    setUpdateTenantModal(true);
  }

  async function handleUpdateTenantSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...editTenantData,
        roomId: editTenantData.roomId === "" ? null : editTenantData.roomId
      };

      const response = await axios.put(
        `${API_URL}/admin/users/${editTenantData.userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const updated = response?.data?.updatedUser || response?.data?.user;
      if (updated) {
        setTenants((prev) =>
          prev.map((t) => ((t.userId || t.id) === (updated.userId || updated.id) ? updated : t))
        );
      } else {
        window.location.reload();
      }

      setUpdateTenantModal(false);
    } catch (error) {
      console.error("Failed to update tenant:", error.response?.data || error.message);
    }
  }

  async function handleDeleteTenant(userId) {
    const isConfirmed = window.confirm("Are you sure you want to remove this tenant? This action cannot be undone.");
    if (!isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTenants((prev) => prev.filter((t) => (t.userId || t.id) !== userId));
    } catch (error) {
      console.error("Failed to delete tenant:", error.response?.data || error.message);
    }
  }
 
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <LoggedInNavbar />

      <main className="grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {hostel?.name || "Hostel Details"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage rooms and tenants for this property.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Rooms</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">{totalRooms}</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
            <p className="text-sm text-slate-500">Occupancy</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">{occupancy}</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-slate-500">Tenants</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">{totalTenants}</h2>
          </div>
        </div>

        {/* Rooms Section */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Manage Rooms</h2>
              <p className="text-sm text-slate-500">Create, update and remove rooms.</p>
            </div>

            <button 
              onClick={() => setRegisterRoomModal(true)} 
              className="w-full md:w-auto px-4 py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              + Add Room
            </button>
          </div>

          <div className="space-y-4">
            {rooms.length === 0 ? (
              <p className="text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-200">No rooms added yet.</p>
            ) : (
              rooms.map((room) => (
                <div
                  key={room.roomId}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{room.roomName}</h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                        <span>Capacity: {room.capacity}</span>
                        <span>Rent: ₹{room.rent}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full lg:w-auto">
                      <button onClick={() => handleOpenUpdateRoomModal(room)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteRoom(room.roomId)} className="px-3 py-2 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Tenants Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Manage Tenants</h2>
              <p className="text-sm text-slate-500">Track residents and their room allocations.</p>
            </div>

            <button 
              onClick={() => setRegisterTenantModal(true)} 
              className="w-full md:w-auto px-4 py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              + Add Tenant
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {tenants.length === 0 ? (
              <p className="text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-200 col-span-full">No tenants registered yet.</p>
            ) : (
              tenants.map((tenant) => (
                <div key={tenant.userId || tenant.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        {tenant.name || tenant.username}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Room: {tenant.roomName || "Unassigned"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {tenant.email}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Active
                      </span>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleOpenUpdateTenantModal(tenant)} className="px-2.5 py-1 border border-slate-300 rounded text-xs font-medium hover:bg-slate-50">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteTenant(tenant.userId || tenant.id)} className="px-2.5 py-1 text-red-600 border border-red-200 rounded text-xs font-medium hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Add Room Modal */}
      {registerRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add New Room</h3>
              <button onClick={() => setRegisterRoomModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleRegisterRoom} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Room Name / Number</label>
                <input
                  type="text"
                  required
                  name="roomName"
                  value={newRoomData.roomName}
                  onChange={handleRoomInputChange}
                  placeholder="e.g. Room 101"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Capacity</label>
                <input
                  type="number"
                  required
                  name="capacity"
                  value={newRoomData.capacity}
                  onChange={handleRoomInputChange}
                  placeholder="e.g. 2"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Rent (₹)</label>
                <input
                  type="number"
                  required
                  name="rent"
                  value={newRoomData.rent}
                  onChange={handleRoomInputChange}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setRegisterRoomModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {updateRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Edit Room</h3>
              <button onClick={() => setUpdateRoomModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleUpdateRoomSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Room Name / Number</label>
                <input
                  type="text"
                  required
                  name="roomName"
                  value={editRoomData.roomName}
                  onChange={handleEditRoomInputChange}
                  placeholder="e.g. Room 101"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Capacity</label>
                <input
                  type="number"
                  required
                  name="capacity"
                  value={editRoomData.capacity}
                  onChange={handleEditRoomInputChange}
                  placeholder="e.g. 2"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Rent (₹)</label>
                <input
                  type="number"
                  required
                  name="rent"
                  value={editRoomData.rent}
                  onChange={handleEditRoomInputChange}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setUpdateRoomModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">Update Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {registerTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add New Tenant</h3>
              <button onClick={() => setRegisterTenantModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleRegisterTenant} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={newTenantData.name}
                  onChange={handleTenantInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={newTenantData.email}
                  onChange={handleTenantInputChange}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Assign Room</label>
                <select
                  name="roomId"
                  value={newTenantData.roomId}
                  onChange={handleTenantInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white"
                >
                  <option value="">Unassigned (No Room)</option>
                  {rooms.map((room) => (
                    <option key={room.roomId} value={room.roomId}>
                      {room.roomName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setRegisterTenantModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">Save Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {updateTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Edit Tenant</h3>
              <button onClick={() => setUpdateTenantModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleUpdateTenantSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Full Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={editTenantData.name}
                  onChange={handleEditTenantInputChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={editTenantData.email}
                  onChange={handleEditTenantInputChange}
                  placeholder="e.g. rahul@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Assign Room</label>
                <select
                  name="roomId"
                  value={editTenantData.roomId}
                  onChange={handleEditTenantInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white"
                >
                  <option value="">Unassigned (No Room)</option>
                  {rooms.map((room) => (
                    <option key={room.roomId} value={room.roomId}>
                      {room.roomName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setUpdateTenantModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">Update Tenant</button>
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
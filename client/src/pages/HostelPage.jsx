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
  
  const [newRoomData, setNewRoomData] = useState({ roomName: "", capacity: "", rent: "" });
  const [editRoomData, setEditRoomData] = useState({ roomId: "", roomName: "", capacity: "", rent: "" });
  
  const [registerRoomModal, setRegisterRoomModal] = useState(false);
  const [updateRoomModal, setUpdateRoomModal] = useState(false);

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

  // Handle input changes dynamically for Add Room
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoomData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes dynamically for Edit Room
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditRoomData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new room to backend
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

  // Open Edit Modal with selected room data
  function handleOpenUpdateModal(room) {
    setEditRoomData({
      roomId: room.roomId,
      roomName: room.roomName,
      capacity: room.capacity,
      rent: room.rent,
    });
    setUpdateRoomModal(true);
  }

  // Submit Updated Room to Backend
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

  // Delete a room with confirmation
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
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {totalRooms}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
            <p className="text-sm text-slate-500">Occupancy</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {occupancy}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-slate-500">Tenants</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {totalTenants}
            </h2>
          </div>
        </div>

        {/* Rooms Section */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Manage Rooms
              </h2>
              <p className="text-sm text-slate-500">
                Create, update and remove rooms.
              </p>
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
                      <h3 className="font-bold text-slate-900 text-lg">
                        {room.roomName}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                        <span>Capacity: {room.capacity}</span>
                        <span>Rent: ₹{room.rent}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full lg:w-auto">
                      <button onClick={() => handleOpenUpdateModal(room)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Manage Tenants
              </h2>
              <p className="text-sm text-slate-500">
                Track residents and their room allocations.
              </p>
            </div>

            <button className="w-full md:w-auto px-4 py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
              + Add Tenant
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {tenants.length === 0 ? (
              <p className="text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-200">No tenants registered yet.</p>
            ) : (
              tenants.map((tenant) => (
                <div key={tenant.userId || tenant.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {tenant.name || tenant.username}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Room: {tenant.roomName || "Unassigned"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {tenant.phone || tenant.email}
                      </p>
                    </div>
                    <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium self-start">
                      Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Add Room Modal Component */}
      {registerRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Add New Room</h3>
              <button 
                onClick={() => setRegisterRoomModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterRoom} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Room Name / Number</label>
                <input
                  type="text"
                  required
                  name="roomName"
                  value={newRoomData.roomName}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRegisterRoomModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal Component */}
      {updateRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Edit Room</h3>
              <button 
                onClick={() => setUpdateRoomModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateRoomSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 block">Room Name / Number</label>
                <input
                  type="text"
                  required
                  name="roomName"
                  value={editRoomData.roomName}
                  onChange={handleEditInputChange}
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
                  onChange={handleEditInputChange}
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
                  onChange={handleEditInputChange}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUpdateRoomModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
                >
                  Update Room
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
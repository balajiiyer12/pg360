import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export default function HostelDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [roomModal, setRoomModal] = useState(false);
  const [userModal, setUserModal] = useState(false);

  const [roomForm, setRoomForm] = useState({
    roomName: "",
    capacity: "",
    rent: "",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    roomId: "",
  });

  const [editingRoom, setEditingRoom] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [hostelRes, roomsRes, tenantsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/hostel/${id}`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/admin/hostel/${id}/room`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/admin/users/hostel/${id}`, { credentials: "include" }),
      ]);

      const hostelData = await hostelRes.json();
      const roomsData = await roomsRes.json();
      const tenantsData = await tenantsRes.json();

      if (!hostelRes.ok) throw new Error(hostelData?.message || hostelData?.msg || "Failed to load hostel data");
      if (!roomsRes.ok) throw new Error(roomsData?.message || roomsData?.msg || "Failed to load rooms data");
      if (!tenantsRes.ok) throw new Error(tenantsData?.message || tenantsData?.msg || "Failed to load tenants data");

      if (hostelData?.success) setHostel(hostelData.hostel);
      if (roomsData?.success) setRooms(roomsData.allRooms || []);
      if (tenantsData?.success) setUsers(tenantsData.tenants || []);
    } catch (err) {
      setError(err.message || "Failed to load hostel data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Derived occupancy
  const totalCapacity = rooms.reduce((sum, r) => sum + (Number(r.capacity) || 0), 0);
  const occupancy =
    totalCapacity > 0
      ? `${Math.min(100, Math.round((users.length / totalCapacity) * 100))}%`
      : rooms.length > 0 && users.length > 0
      ? "100%"
      : "0%";

  /* ROOMS MANAGEMENT */

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        roomName: roomForm.roomName.trim(),
        capacity: Number(roomForm.capacity),
        rent: Number(roomForm.rent),
      };

      const url = editingRoom
        ? `${API_BASE_URL}/admin/hostel/rooms/${editingRoom.roomId}`
        : `${API_BASE_URL}/admin/hostel/${id}/room`;

      const method = editingRoom ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to save room");
      }

      setSuccess(editingRoom ? "Room updated successfully!" : "Room added successfully!");
      setRoomForm({ roomName: "", capacity: "", rent: "" });
      setEditingRoom(null);
      setRoomModal(false);
      fetchAllData();
    } catch (err) {
      setError(err.message || "Failed to save room");
    } finally {
      setSubmitting(false);
    }
  };

  const editRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      roomName: room.roomName,
      capacity: room.capacity,
      rent: room.rent,
    });
    setRoomModal(true);
  };

  const deleteRoom = async (roomId) => {
    const confirmed = window.confirm("Delete this room? Any tenant assigned to this room will have their assignment unlinked.");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/admin/hostel/rooms/${roomId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to delete room");
      }

      setSuccess("Room deleted successfully!");
      fetchAllData();
    } catch (err) {
      setError(err.message || "Failed to delete room");
    }
  };

  /* USERS / TENANTS MANAGEMENT */

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: userForm.name.trim(),
        email: userForm.email.trim(),
        roomId: userForm.roomId || null,
      };
      if (userForm.password) {
        payload.password = userForm.password;
      }

      if (!editingUser && !userForm.password) {
        setError("Password is required for new tenant account");
        setSubmitting(false);
        return;
      }

      const url = editingUser
        ? `${API_BASE_URL}/admin/users/${editingUser.id}`
        : `${API_BASE_URL}/admin/users`;

      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to save tenant");
      }

      setSuccess(editingUser ? "Tenant updated successfully!" : "Tenant created and assigned successfully!");
      setUserForm({ name: "", email: "", password: "", roomId: "" });
      setEditingUser(null);
      setUserModal(false);
      fetchAllData();
    } catch (err) {
      setError(err.message || "Failed to save tenant");
    } finally {
      setSubmitting(false);
    }
  };

  const editUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      roomId: user.roomId || "",
    });
    setUserModal(true);
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm("Delete this tenant account?");
    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || data?.msg || "Failed to delete tenant");
      }

      setSuccess("Tenant removed successfully!");
      fetchAllData();
    } catch (err) {
      setError(err.message || "Failed to delete tenant");
    }
  };

  if (loading && !hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 font-medium">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="text-2xl font-bold">
              PG360
            </Link>
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link to="/admin/dashboard" className="hover:text-slate-900">Dashboard</Link>
              <Link to="/admin/hostels" className="text-slate-900 font-semibold">Hostels</Link>
              <Link to="/admin/complaints" className="hover:text-slate-900">Complaints</Link>
            </div>
          </div>

          <button
            onClick={() => navigate("/admin/hostels")}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            ← Back to All Hostels
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Hostel Details Header */}
        <div className="bg-white border rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold text-slate-900">
                  {hostel?.name || "Hostel Details"}
                </h1>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                  ID: {hostel?.hostelId?.slice(0, 8)}...
                </span>
              </div>
              <p className="text-slate-500 mt-2 text-sm max-w-3xl leading-relaxed">
                {hostel?.description}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingRoom(null);
                  setRoomForm({ roomName: "", capacity: "", rent: "" });
                  setRoomModal(true);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                + Add Room
              </button>

              <button
                onClick={() => {
                  setEditingUser(null);
                  setUserForm({ name: "", email: "", password: "", roomId: rooms[0]?.roomId || "" });
                  setUserModal(true);
                }}
                className="border border-slate-300 hover:bg-slate-50 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                + Add Tenant
              </button>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Total Rooms</p>
            <h2 className="text-3xl font-bold mt-2 text-slate-900">
              {rooms.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Total Bed Capacity</p>
            <h2 className="text-3xl font-bold mt-2 text-slate-900">
              {totalCapacity}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Enrolled Tenants</p>
            <h2 className="text-3xl font-bold mt-2 text-slate-900">
              {users.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">Occupancy Rate</p>
            <h2 className="text-3xl font-bold mt-2 text-emerald-600">
              {occupancy}
            </h2>
          </div>
        </div>

        {/* Tabs / Main Grid: Rooms on Left, Tenants on Right */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* ROOMS LIST */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Rooms</h2>
                <p className="text-xs text-slate-500 mt-0.5">Rooms available in {hostel?.name}</p>
              </div>
              <button
                onClick={() => {
                  setEditingRoom(null);
                  setRoomForm({ roomName: "", capacity: "", rent: "" });
                  setRoomModal(true);
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-md transition cursor-pointer"
              >
                + Add Room
              </button>
            </div>

            {rooms.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-xl text-slate-500">
                <p className="text-sm font-medium">No rooms added yet.</p>
                <p className="text-xs text-slate-400 mt-1">Click "+ Add Room" to create the first room.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rooms.map((room) => (
                  <div
                    key={room.roomId}
                    className="border rounded-xl p-4 hover:border-slate-300 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-slate-900">
                          {room.roomName}
                        </h3>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                          Cap: {room.capacity} Beds
                        </span>
                      </div>
                      <p className="text-sm font-medium text-emerald-700 mt-1">
                        ₹{room.rent?.toLocaleString()} / month
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editRoom(room)}
                        className="border px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRoom(room.roomId)}
                        className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1.5 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TENANTS LIST */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Assigned Tenants</h2>
                <p className="text-xs text-slate-500 mt-0.5">Tenants residing in this hostel</p>
              </div>
              <button
                onClick={() => {
                  setEditingUser(null);
                  setUserForm({ name: "", email: "", password: "", roomId: rooms[0]?.roomId || "" });
                  setUserModal(true);
                }}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-md transition cursor-pointer"
              >
                + Add Tenant
              </button>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-xl text-slate-500">
                <p className="text-sm font-medium">No tenants enrolled yet.</p>
                <p className="text-xs text-slate-400 mt-1">Register a tenant and assign them to a room.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((tenant) => (
                  <div
                    key={tenant.id}
                    className="border rounded-xl p-4 hover:border-slate-300 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base text-slate-900">
                          {tenant.name}
                        </h3>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                          Room: {tenant.roomName || "Unassigned"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {tenant.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editUser(tenant)}
                        className="border px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(tenant.id)}
                        className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1.5 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ROOMS MODAL */}
        {roomModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingRoom ? "Edit Room" : "Add New Room"}
                </h2>
                <button
                  onClick={() => {
                    setRoomModal(false);
                    setEditingRoom(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRoomSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Room Name / Number</label>
                  <input
                    required
                    placeholder="e.g. 101, A-204"
                    value={roomForm.roomName}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        roomName: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Capacity (Bed Count)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 2"
                    value={roomForm.capacity}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 8500"
                    value={roomForm.rent}
                    onChange={(e) =>
                      setRoomForm({
                        ...roomForm,
                        rent: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRoomModal(false);
                      setEditingRoom(null);
                    }}
                    className="border px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    {submitting ? "Saving..." : editingRoom ? "Update Room" : "Add Room"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* USERS MODAL */}
        {userModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingUser ? "Edit Tenant Details" : "Register Tenant Account"}
                </h2>
                <button
                  onClick={() => {
                    setUserModal(false);
                    setEditingUser(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={userForm.name}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        name: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password {editingUser && <span className="text-xs text-slate-400 font-normal">(Leave blank to keep unchanged)</span>}
                  </label>
                  <input
                    type="password"
                    placeholder={editingUser ? "New password (optional)" : "Account password"}
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-slate-900 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Assign to Room</label>
                  <select
                    value={userForm.roomId}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        roomId: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2.5 outline-none focus:border-slate-900 transition bg-white"
                  >
                    <option value="">Unassigned</option>
                    {rooms.map((room) => (
                      <option key={room.roomId} value={room.roomId}>
                        {room.roomName} (Rent: ₹{room.rent}, Cap: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUserModal(false);
                      setEditingUser(null);
                    }}
                    className="border px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer"
                  >
                    {submitting ? "Saving..." : editingUser ? "Update Tenant" : "Register Tenant"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
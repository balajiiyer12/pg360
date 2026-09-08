import { useState } from "react";

export default function HostelDetailsPage() {
  const hostel = {
    id: 1,
    name: "Sunrise PG",
    description: "Premium accommodation near IT Park.",
  };

  const [roomModal, setRoomModal] = useState(false);
  const [userModal, setUserModal] = useState(false);

  const [rooms, setRooms] = useState([
    {
      id: 1,
      roomName: "A-101",
      capacity: 2,
      rent: 12000,
    },
    {
      id: 2,
      roomName: "A-102",
      capacity: 3,
      rent: 15000,
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      password: "password123",
      roomNo: "A-101",
    },
  ]);

  const [roomForm, setRoomForm] = useState({
    roomName: "",
    capacity: "",
    rent: "",
  });

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    roomNo: "",
  });

  const [editingRoom, setEditingRoom] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  /* ROOMS */

  const handleRoomSubmit = (e) => {
    e.preventDefault();

    if (editingRoom) {
      setRooms(
        rooms.map((room) =>
          room.id === editingRoom
            ? { ...room, ...roomForm }
            : room
        )
      );

      setEditingRoom(null);
    } else {
      setRooms([
        ...rooms,
        {
          id: Date.now(),
          ...roomForm,
        },
      ]);
    }

    setRoomForm({
      roomName: "",
      capacity: "",
      rent: "",
    });
  };

  const editRoom = (room) => {
    setEditingRoom(room.id);
    setRoomForm(room);
  };

  const deleteRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

  /* USERS */

  const handleUserSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser
            ? { ...user, ...userForm }
            : user
        )
      );

      setEditingUser(null);
    } else {
      setUsers([
        ...users,
        {
          id: Date.now(),
          ...userForm,
        },
      ]);
    }

    setUserForm({
      name: "",
      email: "",
      password: "",
      roomNo: "",
    });
  };

  const editUser = (user) => {
    setEditingUser(user.id);
    setUserForm(user);
  };

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Hostel Details */}

        <div className="bg-white border rounded-2xl p-6 mb-6">
          <h1 className="text-3xl font-semibold">
            {hostel.name}
          </h1>

          <p className="text-slate-500 mt-2">
            {hostel.description}
          </p>
        </div>

        {/* Analytics */}

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border rounded-2xl p-5">
            <p className="text-slate-500 text-sm">
              Total Rooms
            </p>

            <h2 className="text-3xl font-semibold mt-2">
              {rooms.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <p className="text-slate-500 text-sm">
              Total Tenants
            </p>

            <h2 className="text-3xl font-semibold mt-2">
              {users.length}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <p className="text-slate-500 text-sm">
              Occupancy
            </p>

            <h2 className="text-3xl font-semibold mt-2">
              85%
            </h2>
          </div>
        </div>

        {/* Actions */}

        <div className="flex gap-4">
          <button
            onClick={() => setRoomModal(true)}
            className="bg-slate-900 text-white px-5 py-3 rounded-lg"
          >
            Manage Rooms
          </button>

          <button
            onClick={() => setUserModal(true)}
            className="border px-5 py-3 rounded-lg"
          >
            Manage Users
          </button>
        </div>

        {/* ROOMS MODAL */}

        {roomModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Manage Rooms
                </h2>

                <button
                  onClick={() => setRoomModal(false)}
                  className="text-slate-500"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleRoomSubmit}
                className="space-y-4 mb-8"
              >
                <input
                  placeholder="Room Name"
                  value={roomForm.roomName}
                  onChange={(e) =>
                    setRoomForm({
                      ...roomForm,
                      roomName: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />

                <input
                  type="number"
                  placeholder="Capacity"
                  value={roomForm.capacity}
                  onChange={(e) =>
                    setRoomForm({
                      ...roomForm,
                      capacity: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />

                <input
                  type="number"
                  placeholder="Rent"
                  value={roomForm.rent}
                  onChange={(e) =>
                    setRoomForm({
                      ...roomForm,
                      rent: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />

                <input
                  value={hostel.name}
                  disabled
                  className="w-full border rounded-lg px-4 py-3 bg-slate-100"
                />

                <button className="bg-slate-900 text-white px-5 py-3 rounded-lg">
                  {editingRoom
                    ? "Update Room"
                    : "Add Room"}
                </button>
              </form>

              <div className="space-y-3">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="border rounded-xl p-4"
                  >
                    <h3 className="font-medium">
                      {room.roomName}
                    </h3>

                    <p className="text-slate-500">
                      Capacity: {room.capacity}
                    </p>

                    <p className="text-slate-500">
                      Rent: ₹{room.rent}
                    </p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => editRoom(room)}
                        className="border px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteRoom(room.id)
                        }
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS MODAL */}

        {userModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Manage Users
                </h2>

                <button
                  onClick={() => setUserModal(false)}
                  className="text-slate-500"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleUserSubmit}
                className="space-y-4 mb-8"
              >
                <input
                  placeholder="Name"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />

                <input
                  placeholder="Email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />

                <input
                  placeholder="Password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />

                <select
                  value={userForm.roomNo}
                  onChange={(e) =>
                    setUserForm({
                      ...userForm,
                      roomNo: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >
                  <option value="">
                    Select Room
                  </option>

                  {rooms.map((room) => (
                    <option
                      key={room.id}
                      value={room.roomName}
                    >
                      {room.roomName}
                    </option>
                  ))}
                </select>

                <button className="bg-slate-900 text-white px-5 py-3 rounded-lg">
                  {editingUser
                    ? "Update User"
                    : "Add User"}
                </button>
              </form>

              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-xl p-4"
                  >
                    <h3 className="font-medium">
                      {user.name}
                    </h3>

                    <p className="text-slate-500">
                      {user.email}
                    </p>

                    <p className="text-slate-500">
                      Room: {user.roomNo}
                    </p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => editUser(user)}
                        className="border px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteUser(user.id)
                        }
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageHostels() {
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([
    {
      id: 1,
      name: "Sunrise PG",
      description: "Premium accommodation near IT Park.",
    },
    {
      id: 2,
      name: "Green Valley PG",
      description: "Comfortable PG for students and working professionals.",
    },
  ]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setHostels(
        hostels.map((hostel) =>
          hostel.id === editingId
            ? { ...hostel, ...formData }
            : hostel
        )
      );

      setEditingId(null);
    } else {
      const newHostel = {
        id: Date.now(),
        ...formData,
      };

      setHostels((prev) => [...prev, newHostel]);
    }

    setFormData({
      name: "",
      description: "",
    });
  };

  const handleEdit = (hostel) => {
    setEditingId(hostel.id);

    setFormData({
      name: hostel.name,
      description: hostel.description,
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Delete this hostel?"
    );

    if (confirmed) {
      setHostels((prev) =>
        prev.filter((hostel) => hostel.id !== id)
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold">
            Manage Hostels
          </h1>

          <p className="text-slate-500 mt-2">
            Create, update and manage your hostels.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div>
            <div className="bg-white border rounded-2xl p-6">
              <h2 className="text-lg font-medium mb-6">
                {editingId
                  ? "Edit Hostel"
                  : "Register Hostel"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm mb-2">
                    Hostel Name
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Sunrise PG"
                    className="w-full border rounded-lg px-4 py-3 outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Description
                  </label>

                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Short hostel description..."
                    className="w-full border rounded-lg px-4 py-3 resize-none outline-none focus:border-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white rounded-lg py-3"
                >
                  {editingId
                    ? "Update Hostel"
                    : "Register Hostel"}
                </button>
              </form>
            </div>
          </div>

          {/* Hostel List */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-2xl p-6">
              <h2 className="text-lg font-medium mb-6">
                Your Hostels
              </h2>

              {hostels.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No hostels found.
                </div>
              ) : (
                <div className="space-y-4">
                  {hostels.map((hostel) => (
                    <div
                      key={hostel.id}
                      className="border rounded-xl p-5"
                    >
                      <div
                        onClick={() =>
                          navigate(
                            `/admin/hostels/${hostel.id}`
                          )
                        }
                        className="cursor-pointer"
                      >
                        <h3 className="font-medium text-lg">
                          {hostel.name}
                        </h3>

                        <p className="text-slate-500 mt-2">
                          {hostel.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-5">
                        <button
                          onClick={() =>
                            handleEdit(hostel)
                          }
                          className="border rounded-lg px-4 py-2 text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(hostel.id)
                          }
                          className="text-sm text-red-500"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/hostels/${hostel.id}`
                            )
                          }
                          className="ml-auto text-sm text-slate-500"
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
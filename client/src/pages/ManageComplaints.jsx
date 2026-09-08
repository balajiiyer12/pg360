import { useState } from "react";

export default function ManageComplaints() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      hostel: "Sunrise PG",
      tenant: "Rahul Sharma",
      room: "A-204",
      title: "WiFi not working",
      description: "Unable to connect to the internet since morning.",
      status: "Pending",
      date: "20 Sep 2026",
    },
    {
      id: 2,
      hostel: "Green Valley PG",
      tenant: "Amit Kumar",
      room: "B-105",
      title: "Water Leakage",
      description: "Leakage in the bathroom sink.",
      status: "In Progress",
      date: "18 Sep 2026",
    },
  ]);

  const updateStatus = (id, status) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id
          ? { ...complaint, status }
          : complaint
      )
    );
  };

  const deleteComplaint = (id) => {
    const confirmed = window.confirm(
      "Delete this complaint?"
    );

    if (confirmed) {
      setComplaints((prev) =>
        prev.filter((complaint) => complaint.id !== id)
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Manage Complaints
          </h1>

          <p className="text-slate-500 mt-2">
            Review, update and resolve tenant complaints.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-slate-500">
              Total Complaints
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {complaints.length}
            </h2>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-600">
              {
                complaints.filter(
                  (c) => c.status === "Pending"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-slate-500">
              Resolved
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {
                complaints.filter(
                  (c) => c.status === "Resolved"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-5">
          {complaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white border rounded-xl p-6"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-semibold">
                      {complaint.title}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <p className="text-slate-600 mb-4">
                    {complaint.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-500">
                    <p>
                      <strong>Tenant:</strong>{" "}
                      {complaint.tenant}
                    </p>

                    <p>
                      <strong>Room:</strong>{" "}
                      {complaint.room}
                    </p>

                    <p>
                      <strong>Hostel:</strong>{" "}
                      {complaint.hostel}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {complaint.date}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[180px]">
                  <select
                    value={complaint.status}
                    onChange={(e) =>
                      updateStatus(
                        complaint.id,
                        e.target.value
                      )
                    }
                    className="border rounded-lg px-3 py-2"
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>
                  </select>

                  <button
                    onClick={() =>
                      updateStatus(
                        complaint.id,
                        "Resolved"
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Mark Resolved
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        complaint.id,
                        "Pending"
                      )
                    }
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  >
                    Mark Pending
                  </button>

                  <button
                    onClick={() =>
                      deleteComplaint(complaint.id)
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete Complaint
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {complaints.length === 0 && (
          <div className="bg-white border rounded-xl p-12 text-center">
            <p className="text-slate-500">
              No complaints available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
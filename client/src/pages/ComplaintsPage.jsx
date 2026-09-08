import { useState } from "react";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "WiFi not working",
      description: "Internet connection is unstable in my room.",
      status: "Resolved",
      date: "10 Sep 2026",
    },
    {
      id: 2,
      title: "Water Leakage",
      description: "Bathroom sink is leaking continuously.",
      status: "In Progress",
      date: "15 Sep 2026",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComplaint = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    setComplaints([newComplaint, ...complaints]);

    alert("Complaint submitted successfully!");

    setFormData({
      title: "",
      description: "",
    });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (confirmDelete) {
      setComplaints(
        complaints.filter((complaint) => complaint.id !== id)
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Complaints</h1>
          <p className="text-slate-500 mt-2">
            Raise a new complaint and track existing ones.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* New Complaint Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">
                Raise New Complaint
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Complaint Title
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Enter complaint title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>

                  <textarea
                    required
                    rows={5}
                    placeholder="Describe the issue..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium"
                >
                  Submit Complaint
                </button>
              </form>
            </div>
          </div>

          {/* Complaint History */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">
                Complaint History
              </h2>

              <div className="space-y-4">
                {complaints.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    No complaints found.
                  </div>
                ) : (
                  complaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="border rounded-lg p-5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {complaint.title}
                          </h3>

                          <p className="text-slate-600 mt-2">
                            {complaint.description}
                          </p>

                          <p className="text-sm text-slate-400 mt-3">
                            Submitted on {complaint.date}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-3 ml-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              complaint.status
                            )}`}
                          >
                            {complaint.status}
                          </span>

                          {complaint.status === "Pending" && (
                            <button
                              onClick={() =>
                                handleDelete(complaint.id)
                              }
                              className="text-red-600 text-sm hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
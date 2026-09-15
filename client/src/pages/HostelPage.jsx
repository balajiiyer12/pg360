import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

import LoggedInNavbar from "../components/LoggedInNavbar";
import Footer from "../components/Footer";

function HostelPage() {
  const { hostelid } = useParams();
  const token = localStorage.getItem("token");
  const[rooms,setRooms] = useState([]);
  const [hostel,setHostel] = useState();
  const [tenants,setTenants] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalTenants: 0,
    occupancy: "0%",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [roomsRes,hostelRes,tenantsRes] = await Promise.all([
          axios.get(
            `${API_URL}/admin/hostel/${hostelid}/room`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          ),
          axios.get(

           `${API_URL}/admin/hostel/${hostelid}`,
            { 
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }),
          axios.get(

           `${API_URL}/admin/users/hostel/${hostelid}`,
            { 
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          ),
        ]);

        setRooms(roomsRes?.data?.allRooms || []);
        setHostel(hostelRes?.data?.hostel);
        setTenants(tenantsRes?.data?.tenants || []);

        const totalCapacity = rooms.reduce(
          (sum, room) => sum + Number(room.capacity || 0),
          0
        );

        const occupancy =
          totalCapacity > 0
            ? `${Math.round((tenants.length / totalCapacity) * 100)}%`
            : "0%";

        setStats({
          totalRooms: rooms.length,
          totalTenants: tenants.length,
          occupancy,
        });
      } catch (error) {
        console.error("Failed to fetch hostel stats:", error);
      }
    };

    fetchStats();
  }, [hostelid]);

  const occupied = tenants.filter(
  (tenant) => tenant.roomId === room.roomId
  ).length;
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <LoggedInNavbar />

      <main className="grow max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {hostel.name}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage rooms and tenants for this property.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Rooms</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {stats.totalRooms}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
            <p className="text-sm text-slate-500">Occupancy</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {stats.occupancy}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-slate-500">Tenants</p>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              {stats.totalTenants}
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

            <button className="w-full md:w-auto px-4 py-3 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors">
              + Add Room
            </button>
          </div>

          <div className="space-y-4">
  {rooms.map((room) => {
    return (
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

          <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
            <button className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
              View
            </button>

            <button className="px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">
              Edit
            </button>

            <button className="px-3 py-2 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  })}
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
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Rahul Sharma
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Room 101
                  </p>

                  <p className="text-sm text-slate-500">
                    +91 9876543210
                  </p>
                </div>

                <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Amit Verma
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Room 102
                  </p>

                  <p className="text-sm text-slate-500">
                    +91 9123456780
                  </p>
                </div>

                <span className="inline-flex px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HostelPage;
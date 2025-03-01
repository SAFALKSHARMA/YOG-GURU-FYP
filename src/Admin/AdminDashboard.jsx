import React from "react";
import Sidebar from "./Sidebar";
import { Users, BookOpen, DollarSign, Clock } from "lucide-react";

const AdminDashboard = () => {
  // Static data for now
  const stats = {
    users: 120,
    classes: 15,
    earnings: 4500,
    pending: 4,
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Dashboard Content */}
      <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg m-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          Admin Dashboard
        </h1>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="p-6 bg-purple-100 rounded-lg flex items-center shadow-md">
            <Users className="text-purple-700" size={36} />
            <div className="ml-4">
              <p className="text-gray-700 text-sm">Total Users</p>
              <h2 className="text-xl font-bold text-purple-900">
                {stats.users}
              </h2>
            </div>
          </div>

          {/* Active Classes */}
          <div className="p-6 bg-blue-100 rounded-lg flex items-center shadow-md">
            <BookOpen className="text-blue-700" size={36} />
            <div className="ml-4">
              <p className="text-gray-700 text-sm">Active Classes</p>
              <h2 className="text-xl font-bold text-blue-900">
                {stats.classes}
              </h2>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="p-6 bg-green-100 rounded-lg flex items-center shadow-md">
            <DollarSign className="text-green-700" size={36} />
            <div className="ml-4">
              <p className="text-gray-700 text-sm">Total Earnings</p>
              <h2 className="text-xl font-bold text-green-900">
                ${stats.earnings}
              </h2>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="p-6 bg-red-100 rounded-lg flex items-center shadow-md">
            <Clock className="text-red-700" size={36} />
            <div className="ml-4">
              <p className="text-gray-700 text-sm">Pending Approvals</p>
              <h2 className="text-xl font-bold text-red-900">
                {stats.pending}
              </h2>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Activities
          </h2>
          <ul className="space-y-3">
            <li className="p-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition">
              ✅ User **John Doe** was approved as an **Instructor**
            </li>
            <li className="p-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition">
              📚 New Yoga Class **"Sunrise Meditation"** added
            </li>
            <li className="p-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition">
              ⏳ **3 Instructor Applications** pending approval
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

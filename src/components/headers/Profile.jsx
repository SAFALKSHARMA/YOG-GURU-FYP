import React from "react";
import UserSidebar from "./UserSidebar";
import { Users, BookOpen, DollarSign, Clock } from "lucide-react";

const Profile = () => {
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
      <UserSidebar />

      {/* Dashboard Content */}
      <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg m-4 overflow-y-auto">
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          User Profile
        </h1>
      </div>
    </div>
  );
};

export default Profile;

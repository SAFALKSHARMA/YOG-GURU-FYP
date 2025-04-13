// ProfileInfo.js
import React, { useContext } from "react";
import { Mail, Phone, MapPin, Edit, User, Calendar } from "lucide-react";
import { AppContent } from "../context/AppContext";

const ProfileInfo = () => {
  const { userData } = useContext(AppContent);

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-purple-100">
      {/* Header section with purple gradient */}
      <div className="px-8 py-6 bg-gradient-to-r from-purple-500 to-purple-400">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <User className="mr-3 h-5 w-5" />
          Profile Information
        </h3>
        <p className="mt-2 text-sm text-purple-100">
          Your personal information and contact details
        </p>
      </div>

      {/* Content section with modern card design */}
      <div className="p-8">
        {/* Info cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name card */}
          <div className="bg-purple-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xs uppercase font-medium text-purple-500 tracking-wider mb-2">
              Full Name
            </h4>
            <p className="text-lg font-medium text-purple-900 flex items-center">
              {userData?.name || "Not provided"}
            </p>
          </div>

          {/* Email card */}
          <div className="bg-purple-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xs uppercase font-medium text-purple-500 tracking-wider mb-2">
              Email Address
            </h4>
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-lg font-medium text-purple-900">
                {userData?.email || "Not provided"}
              </p>
            </div>
          </div>

          {/* Phone card */}
          <div className="bg-purple-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xs uppercase font-medium text-purple-500 tracking-wider mb-2">
              Phone Number
            </h4>
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Phone className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-lg font-medium text-purple-900">
                {userData?.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* Location card */}
          <div className="bg-purple-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-xs uppercase font-medium text-purple-500 tracking-wider mb-2">
              Location
            </h4>
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-lg font-medium text-purple-900">
                {userData?.address || "Not provided"}
              </p>
            </div>
          </div>

          {/* Member since card */}
          <div className="bg-purple-50 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
            <h4 className="text-xs uppercase font-medium text-purple-500 tracking-wider mb-2">
              Member Since
            </h4>
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-lg font-medium text-purple-900">
                {userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Bio section with larger card */}
        <div className="mt-6 bg-purple-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-xs uppercase font-medium text-purple-500 tracking-wider mb-3">
            Biography
          </h4>
          <div className="bg-white rounded-lg p-4 text-purple-900">
            {userData?.bio ||
              "No biography provided yet. Click 'Edit Profile' to add your bio."}
          </div>
        </div>

        {/* Edit button */}
        <div className="mt-8 flex justify-end">
          <button className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 transition-colors font-medium">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

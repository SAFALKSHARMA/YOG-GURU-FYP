// ProfileInfo.js
import React, { useContext } from "react";
import { Mail, Phone, MapPin, Edit } from "lucide-react";
import { AppContent } from "../context/AppContext";

const ProfileInfo = () => {
  const { userData } = useContext(AppContent);
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Profile Information
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Your personal information and contact details.
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
            <p className="mt-1 text-sm text-gray-900">{userData?.name}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Email Address</h4>
            <div className="mt-1 flex items-center text-sm text-gray-900">
              <Mail className="mr-2 h-4 w-4 text-gray-400" />
              {userData?.email}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
            <div className="mt-1 flex items-center text-sm text-gray-900">
              <Phone className="mr-2 h-4 w-4 text-gray-400" />
              {userData?.phone}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Location</h4>
            <div className="mt-1 flex items-center text-sm text-gray-900">
              <MapPin className="mr-2 h-4 w-4 text-gray-400" />
              {userData?.address}
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500">Bio</h4>
          <p className="mt-1 text-sm text-gray-900">{userData?.bio}</p>
        </div>

        <div className="mt-6">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Edit className="mr-2 h-4 w-4 text-gray-500" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

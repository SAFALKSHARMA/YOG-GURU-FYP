import React, { useContext, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Edit,
  User,
  Calendar,
  Save,
  X,
} from "lucide-react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProfileInfo = () => {
  const { userData, setUserData, backendUrl } = useContext(AppContent);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    bio: userData?.bio || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const { email, ...updateData } = formData;
      const userId = userData?.userId;

      const response = await axios.put(
        `${backendUrl}/api/user/update-profile/${userId}`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserData((prev) => ({ ...prev, ...updateData }));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
      bio: userData?.bio || "",
    });
    setIsEditing(false);
  };

  return (
    <section className="max-w-4xl mx-auto">
      {/* Modern gradient header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Profile Information
            </h2>
          </div>
        </div>

        {/* Action buttons */}
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all shadow-sm"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all shadow-sm"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      {/* Grid layout for profile info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Full Name
          </span>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          ) : (
            <p className="text-gray-800 font-medium mt-1">
              {userData?.name || "Not provided"}
            </p>
          )}
        </div>

        {/* Email card - Not editable */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Email Address
          </span>
          <div className="flex items-center mt-1">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg mr-3">
              <Mail className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-gray-800 font-medium">
              {userData?.email || "Not provided"}
            </p>
          </div>
          {isEditing && (
            <p className="text-xs text-gray-500 mt-1 italic">
              Email address cannot be changed
            </p>
          )}
        </div>

        {/* Phone card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Phone Number
          </span>
          <div className="flex items-center mt-1">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg mr-3">
              <Phone className="h-4 w-4 text-indigo-600" />
            </div>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                {userData?.phone || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Location card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Location
          </span>
          <div className="flex items-center mt-1">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg mr-3">
              <MapPin className="h-4 w-4 text-indigo-600" />
            </div>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                {userData?.address || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Member since card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all md:col-span-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Member Since
          </span>
          <div className="flex items-center mt-1">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg mr-3">
              <Calendar className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-gray-800 font-medium">
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

        {/* Bio section - Full width */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all md:col-span-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
            Biography
          </span>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-700 min-h-24">
              {userData?.bio ||
                "No biography provided yet. Click 'Edit Profile' to add your bio."}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileInfo;

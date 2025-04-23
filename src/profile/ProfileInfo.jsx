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
      // Create a copy of formData without the email field
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
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-md">
      {/* Header section - Changed to match sidebar's indigo color scheme */}
      <div className="px-6 py-5 bg-indigo-500">
        <div className="flex items-center">
          <div className="p-2 mr-4 bg-white bg-opacity-20 rounded-lg">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              Profile Information
            </h3>
            <p className="text-sm text-indigo-100 mt-1">
              {isEditing
                ? "Edit your personal information"
                : "Your personal details"}
            </p>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="p-6">
        {/* Info cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name card */}
          <div className="bg-gray-50 rounded-md p-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            ) : (
              <p className="text-gray-800 font-medium">
                {userData?.name || "Not provided"}
              </p>
            )}
          </div>

          {/* Email card - Not editable */}
          <div className="bg-gray-50 rounded-md p-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
              Email Address
            </label>
            <div className="flex items-center">
              <div className="bg-indigo-100 p-1.5 rounded-md mr-3">
                <Mail className="h-4 w-4 text-indigo-600" />
              </div>
              <p className="text-gray-800 font-medium">
                {userData?.email || "Not provided"}
              </p>
            </div>
            {isEditing && (
              <p className="text-xs text-gray-500 mt-1">
                Email address cannot be changed
              </p>
            )}
          </div>

          {/* Phone card */}
          <div className="bg-gray-50 rounded-md p-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
              Phone Number
            </label>
            <div className="flex items-center">
              <div className="bg-indigo-100 p-1.5 rounded-md mr-3">
                <Phone className="h-4 w-4 text-indigo-600" />
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              ) : (
                <p className="text-gray-800 font-medium">
                  {userData?.phone || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Location card */}
          <div className="bg-gray-50 rounded-md p-4">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
              Location
            </label>
            <div className="flex items-center">
              <div className="bg-indigo-100 p-1.5 rounded-md mr-3">
                <MapPin className="h-4 w-4 text-indigo-600" />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              ) : (
                <p className="text-gray-800 font-medium">
                  {userData?.address || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Member since card */}
          <div className="bg-gray-50 rounded-md p-4 md:col-span-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
              Member Since
            </label>
            <div className="flex items-center">
              <div className="bg-indigo-100 p-1.5 rounded-md mr-3">
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
        </div>

        {/* Bio section */}
        <div className="mt-4 bg-gray-50 rounded-md p-4">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">
            Biography
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <div className="bg-white rounded-md p-3 text-gray-800">
              {userData?.bio ||
                "No biography provided yet. Click 'Edit Profile' to add your bio."}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

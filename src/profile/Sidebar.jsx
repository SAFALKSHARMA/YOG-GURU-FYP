// Sidebar.js
import React, { useContext, useRef, useState } from "react";
import { AppContent } from "../context/AppContext";
import {
  User,
  BookOpen,
  Heart,
  Calendar,
  Settings,
  LogOut,
  Edit,
  ArrowRightCircle,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { userData, setUserData, setIsLoggedin, backendUrl } =
    useContext(AppContent);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleLogout = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/auth/logout");
      if (response.data.success) {
        setIsLoggedin(false);
        setUserData({});
        Cookies.remove("token");
        navigate("/login");
        toast.success("Successfully logged out!");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    setIsUploading(true);
    try {
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        { withCredentials: false }
      );

      const imageUrl = uploadResponse.data.secure_url;

      await axios.put(
        `${backendUrl}/api/user/update-profile-img`,
        { email: userData?.email, image: imageUrl },
        { withCredentials: true }
      );

      setUserData((prevData) => ({ ...prevData, image: imageUrl }));
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      toast.error("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Navigation items configuration
  const navItems = [
    { id: "profile", label: "Profile", icon: User, count: null },
    {
      id: "enrolled",
      label: "My Classes",
      icon: BookOpen,
      count: userData?.enrolledClasses?.length || 0,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      count: userData?.favoriteClasses?.length || 0,
    },
    {
      id: "applications",
      label: "Applications",
      icon: Calendar,
      count: userData?.applications?.length || 0,
    },
    { id: "trackprogress", label: "Progress", icon: TrendingUp, count: null },
    { id: "settings", label: "Settings", icon: Settings, count: null },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden h-full border border-gray-100 sticky top-4">
      {/* Profile Section */}
      <div className="bg-indigo-500 px-4 py-5 flex items-center">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-white shadow-sm">
            <img
              src={userData?.image || "/default-avatar.png"}
              alt={userData?.name || "User"}
              className="rounded-full w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleEditClick}
            className="absolute bottom-0 right-0 bg-white text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition-all shadow-sm"
            disabled={isUploading}
            aria-label="Edit profile picture"
          >
            {isUploading ? (
              <div className="h-3 w-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Edit className="h-3 w-3" />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className="ml-3 overflow-hidden">
          <h2 className="text-base font-medium text-white truncate">
            {userData?.name || "User"}
          </h2>
          <p className="text-xs text-indigo-100">
            Member since{" "}
            {userData?.createdAt
              ? new Date(userData.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "..."}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-3 py-2.5 text-sm rounded-md transition-all ${
                activeTab === item.id
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
              }`}
            >
              <item.icon
                className={`h-4 w-4 mr-3 ${
                  activeTab === item.id ? "text-indigo-600" : "text-gray-500"
                }`}
              />
              {item.label}
              {item.count !== null && (
                <span
                  className={`ml-auto py-0.5 px-2 rounded-full text-xs ${
                    activeTab === item.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Role-based navigation */}
        <div className="mt-6 pt-3 border-t border-gray-100">
          {userData?.role === "admin" && (
            <Link to="/admin/dashboard">
              <button className="flex items-center w-full px-3 py-2.5 text-sm text-gray-600 hover:text-indigo-600 rounded-md hover:bg-gray-50 transition-all">
                <ArrowRightCircle className="h-4 w-4 mr-3 text-gray-500" />
                Admin Dashboard
              </button>
            </Link>
          )}

          {userData?.role === "instructor" && (
            <Link to="/instructor/dashboard">
              <button className="flex items-center w-full px-3 py-2.5 text-sm text-gray-600 hover:text-indigo-600 rounded-md hover:bg-gray-50 transition-all">
                <ArrowRightCircle className="h-4 w-4 mr-3 text-gray-500" />
                Instructor Dashboard
              </button>
            </Link>
          )}

          {userData?.role === "user" && (
            <Link to="/applyInstructor">
              <button className="flex items-center w-full px-3 py-2.5 text-sm text-gray-600 hover:text-indigo-600 rounded-md hover:bg-gray-50 transition-all">
                <ArrowRightCircle className="h-4 w-4 mr-3 text-gray-500" />
                Become an Instructor
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-3 py-2.5 rounded-md text-sm text-white bg-red-500 hover:bg-red-600 transition-all"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

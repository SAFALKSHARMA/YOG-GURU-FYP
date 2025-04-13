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

  return (
    <div className="bg-white shadow-xl rounded-3xl overflow-hidden sticky top-6 border-2 border-purple-200">
      {/* Profile Section - Curved top design */}
      <div className="relative">
        {/* Purple decorative top wave */}
        <div className="h-32 bg-gradient-to-r from-purple-400 to-purple-300 rounded-b-full scale-110 origin-top"></div>

        {/* Profile image and info - positioned over the wave */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pt-12">
          <div className="relative mb-2">
            <div className="w-28 h-28 rounded-full p-1 bg-white shadow-lg">
              <img
                src={userData?.image}
                alt={userData?.name}
                className="rounded-full w-full h-full object-cover border-2 border-purple-200"
              />
            </div>
            <button
              onClick={handleEditClick}
              className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors duration-300 shadow-md"
              disabled={isUploading}
            >
              {isUploading ? "..." : <Edit className="h-4 w-4" />}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {/* Name and member info */}
      <div className="text-center mt-20 mb-6 px-4">
        <h2 className="text-xl font-bold text-purple-800">{userData?.name}</h2>
        <p className="text-sm text-purple-500 mt-1">
          Member since{" "}
          {new Date(userData?.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Navigation Menu */}
      <div className="px-4">
        <nav className="flex flex-col space-y-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
              activeTab === "profile"
                ? "bg-purple-100 text-purple-800 shadow-sm"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <div
              className={`p-2 mr-3 rounded-lg ${
                activeTab === "profile" ? "bg-purple-200" : "bg-gray-100"
              }`}
            >
              <User
                className={`h-4 w-4 ${
                  activeTab === "profile" ? "text-purple-600" : "text-gray-500"
                }`}
              />
            </div>
            Profile Information
          </button>

          <button
            onClick={() => setActiveTab("enrolled")}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
              activeTab === "enrolled"
                ? "bg-purple-100 text-purple-800 shadow-sm"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <div
              className={`p-2 mr-3 rounded-lg ${
                activeTab === "enrolled" ? "bg-purple-200" : "bg-gray-100"
              }`}
            >
              <BookOpen
                className={`h-4 w-4 ${
                  activeTab === "enrolled" ? "text-purple-600" : "text-gray-500"
                }`}
              />
            </div>
            My Enrolled Classes
            <span className="ml-auto bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-medium">
              {userData?.enrolledClasses?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
              activeTab === "favorites"
                ? "bg-purple-100 text-purple-800 shadow-sm"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <div
              className={`p-2 mr-3 rounded-lg ${
                activeTab === "favorites" ? "bg-purple-200" : "bg-gray-100"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${
                  activeTab === "favorites"
                    ? "text-purple-600"
                    : "text-gray-500"
                }`}
              />
            </div>
            Favorite Classes
            <span className="ml-auto bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-medium">
              {userData?.favoriteClasses?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
              activeTab === "applications"
                ? "bg-purple-100 text-purple-800 shadow-sm"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <div
              className={`p-2 mr-3 rounded-lg ${
                activeTab === "applications" ? "bg-purple-200" : "bg-gray-100"
              }`}
            >
              <Calendar
                className={`h-4 w-4 ${
                  activeTab === "applications"
                    ? "text-purple-600"
                    : "text-gray-500"
                }`}
              />
            </div>
            My Applications
            <span className="ml-auto bg-purple-100 text-purple-700 py-1 px-3 rounded-full text-xs font-medium">
              {userData?.applications?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
              activeTab === "settings"
                ? "bg-purple-100 text-purple-800 shadow-sm"
                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
            }`}
          >
            <div
              className={`p-2 mr-3 rounded-lg ${
                activeTab === "settings" ? "bg-purple-200" : "bg-gray-100"
              }`}
            >
              <Settings
                className={`h-4 w-4 ${
                  activeTab === "settings" ? "text-purple-600" : "text-gray-500"
                }`}
              />
            </div>
            Account Settings
          </button>

          {userData?.role === "admin" && (
            <Link to="/admin/dashboard" className="mt-2">
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
                  activeTab === "admin-dashboard"
                    ? "bg-purple-100 text-purple-800 shadow-sm"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <div
                  className={`p-2 mr-3 rounded-lg ${
                    activeTab === "admin-dashboard"
                      ? "bg-purple-200"
                      : "bg-gray-100"
                  }`}
                >
                  <ArrowRightCircle
                    className={`h-4 w-4 ${
                      activeTab === "admin-dashboard"
                        ? "text-purple-600"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                Go to Admin Dashboard
              </button>
            </Link>
          )}
          {userData?.role === "instructor" && (
            <Link to="/instructor/dashboard" className="mt-2">
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
                  activeTab === "instructor-dashboard"
                    ? "bg-purple-100 text-purple-800 shadow-sm"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                } w-full text-left`}
              >
                <div
                  className={`p-2 mr-3 rounded-lg ${
                    activeTab === "instructor-dashboard"
                      ? "bg-purple-200"
                      : "bg-gray-100"
                  }`}
                >
                  <ArrowRightCircle
                    className={`h-4 w-4 ${
                      activeTab === "instructor-dashboard"
                        ? "text-purple-600"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                Go to Instructor Dashboard
              </button>
            </Link>
          )}
          {userData?.role === "user" && (
            <Link to="/applyInstructor" className="mt-2">
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl ${
                  activeTab === "apply-instructor"
                    ? "bg-purple-100 text-purple-800 shadow-sm"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                } w-full text-left`}
              >
                <div
                  className={`p-2 mr-3 rounded-lg ${
                    activeTab === "apply-instructor"
                      ? "bg-purple-200"
                      : "bg-gray-100"
                  }`}
                >
                  <ArrowRightCircle
                    className={`h-4 w-4 ${
                      activeTab === "apply-instructor"
                        ? "text-purple-600"
                        : "text-gray-500"
                    }`}
                  />
                </div>
                Apply for Instructor
              </button>
            </Link>
          )}
        </nav>
      </div>

      {/* Sign Out Button */}
      <div className="p-6 mt-6 mb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-full shadow-md text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

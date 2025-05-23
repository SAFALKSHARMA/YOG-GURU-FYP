// Profile.js
import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import ProfileInfo from "./ProfileInfo";
import EnrolledClasses from "./EnrolledClasses";
import FavoriteClasses from "./FavouriteClasses";
import Applications from "./Applications";
import Settings from "./Settings";
import TrackProgress from "./TrackProgress";
import { AppContent } from "../context/AppContext";
import OrderHistory from "./OrderHistory";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Determine which component to render based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInfo />;
      case "enrolled":
        return <EnrolledClasses />;
      case "favorites":
        return <FavoriteClasses />;
      case "applications":
        return <Applications />;
      case "trackprogress":
        return <TrackProgress />;
      case "settings":
        return <Settings />;
      case "orders":
        return <OrderHistory />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-1xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar - now takes 2 columns */}
          <div className="lg:col-span-2">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Main Content - now takes 8 columns (with 2 columns for sidebar, total 10) */}
          <div className="mt-6 lg:mt-0 lg:col-span-10">
            <div className="bg-white shadow-md rounded-lg p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

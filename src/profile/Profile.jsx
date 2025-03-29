// Profile.js
import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import ProfileInfo from "./ProfileInfo";
import EnrolledClasses from "./EnrolledClasses";
import FavoriteClasses from "./FavouriteClasses";
import Applications from "./Applications";
import Settings from "./Settings";
import { AppContent } from "../context/AppContext";
import axios from "axios";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userData={userData}
            />
          </div>

          {/* Main Content */}
          <div className="mt-8 lg:mt-0 lg:col-span-9">
            {activeTab === "profile" && <ProfileInfo userData={userData} />}
            {activeTab === "enrolled" && <EnrolledClasses />}
            {activeTab === "favorites" && <FavoriteClasses />}
            {activeTab === "applications" && <Applications />}
            {activeTab === "settings" && <Settings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

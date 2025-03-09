import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const InstructorLayout = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default InstructorLayout;

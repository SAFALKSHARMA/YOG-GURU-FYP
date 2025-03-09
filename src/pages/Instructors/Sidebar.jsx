import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderPlus, Library, Users } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/instructor",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      path: "/instructor/add-class",
      icon: <FolderPlus size={20} />,
      label: "Add Class",
    },
    {
      path: "/instructor/my-classes",
      icon: <Library size={20} />,
      label: "My Classes",
    },
    {
      path: "/instructor/students",
      icon: <Users size={20} />,
      label: "Students List",
    },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-800">Yoga Tutor</h2>
        <p className="text-sm text-gray-600">Instructor Panel</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 transition-colors ${
              location.pathname === item.path
                ? "bg-purple-100 border-r-4 border-purple-600"
                : ""
            }`}
          >
            <span className="text-purple-700">{item.icon}</span>
            <span className="ml-3">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

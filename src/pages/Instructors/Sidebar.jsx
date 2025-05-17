import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderPlus,
  Library,
  Users,
  X,
  ChevronLeft,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile if it's open
      if (mobile && isOpen) {
        setIsOpen(false);
      }
      // Auto-open sidebar on desktop if it's closed
      if (!mobile && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const menuItems = [
    {
      path: "/instructor/dashboard",
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
      path: "/instructor/bookings",
      icon: <Users size={20} />,
      label: "Booking",
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button - Fixed position */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-20 left-4 z-30 bg-purple-600 text-white p-2 rounded-md"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 mt-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          h-[calc(100vh-5rem)] bg-white border-r border-gray-200 overflow-y-auto z-20
          transition-all duration-300 ease-in-out
          ${isMobile ? "fixed top-20 left-0" : "sticky top-20"}
          ${isOpen ? (isMobile ? "w-64" : "w-64") : "w-16"}
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Header Section */}
        <div
          className={`p-4 flex items-center border-b border-gray-200 ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isOpen ? (
            <div className="flex items-center">
              <Link
                to="/profile"
                className="flex items-center mr-2 text-gray-700 hover:text-indigo-600"
                title="Back to Profile"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h2 className="text-xl font-bold text-purple-800">
                Instructor Panel
              </h2>
            </div>
          ) : (
            <Link
              to="/profile"
              className="flex items-center text-gray-700 hover:text-indigo-600"
              title="Back to Profile"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-purple-600 transition-colors"
              aria-label="Toggle sidebar"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="mt-2 pb-20">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center py-3 text-gray-700 hover:bg-purple-50 transition-colors
                ${isOpen ? "px-6 justify-start" : "px-0 justify-center"}
                ${
                  location.pathname === item.path
                    ? "bg-purple-100 border-r-4 border-purple-600"
                    : ""
                }
              `}
              onClick={() => isMobile && setIsOpen(false)}
              title={!isOpen ? item.label : ""}
            >
              <span className="text-purple-700">{item.icon}</span>
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

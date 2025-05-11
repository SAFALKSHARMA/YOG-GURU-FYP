import {
  Users,
  BookOpen,
  ShoppingCart,
  FileText,
  Home,
  BarChart2,
  ArrowLeft,
  Shield,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // Check if current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Nav link component to reduce repetition
  const NavLink = ({ to, icon: Icon, text }) => (
    <li>
      <Link
        to={to}
        className={`flex items-center p-2 rounded-lg group ${
          isActive(to)
            ? "bg-indigo-100 text-indigo-600 font-medium"
            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span>{text}</span>
      </Link>
    </li>
  );

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 p-4 flex flex-col ml-4 h-screen sticky top-0">
      {/* Header */}
      <div className="mb-8 p-2 flex items-center justify-center relative">
        <Link
          to="/profile"
          className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 absolute left-0"
          title="Back to Profile"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Admin Panel
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <NavLink to="/admin/dashboard" icon={Home} text="Dashboard" />
          <NavLink to="/admin/manage-users" icon={Users} text="Users" />
          <NavLink to="/admin/manage-classes" icon={BookOpen} text="Classes" />
          <NavLink
            to="/admin/shopList"
            icon={ShoppingCart}
            text="Manage Products"
          />
          <NavLink
            to="/admin/manage-instructors"
            icon={FileText}
            text="Instructor Applications"
          />
          <NavLink
            to="/admin/manage-shop"
            icon={BarChart2}
            text="Add Products"
          />
          <NavLink to="/admin/all-admins" icon={Shield} text="Admins" />
        </ul>
      </nav>

      {/* Optional footer */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          © {new Date().getFullYear()} Your Company
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

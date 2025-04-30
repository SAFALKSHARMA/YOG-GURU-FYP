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
import { Link } from "react-router-dom";

// Sidebar Component
const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 p-4 flex flex-col">
      <div className="mb-8 p-2">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin/dashboard"
              className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group"
            >
              <Home className="w-5 h-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-users"
              className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group"
            >
              <Users className="w-5 h-5 mr-3" />
              <span className="font-medium">Users</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-classes"
              className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group"
            >
              <BookOpen className="w-5 h-5 mr-3" />
              <span className="font-medium">Classes</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/shopList"
              className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group"
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              <span className="font-medium">Products</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-instructors"
              className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group"
            >
              <FileText className="w-5 h-5 mr-3" />
              <span className="font-medium">Applications</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/manage-shop"
              className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group"
            >
              <BarChart2 className="w-5 h-5 mr-3" />
              <span className="font-medium">Add Items</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/all-admins"
              className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group"
            >
              <Shield className="w-5 h-5 mr-3" />
              <span className="font-medium">Admins</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-2">
        <Link
          to="/"
          className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 group"
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          <span className="font-medium">Back to Website</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

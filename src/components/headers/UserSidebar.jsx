import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, Book, FileText, LogOut } from "lucide-react";
import logo from "../../assets/dashboard/yoglogo.png";
import { AppContent } from "../../context/AppContext";
import { useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios"; // Make sure axios is imported
import Cookies from "js-cookie"; // Make sure Cookies is imported

const Sidebar = () => {
  const { backendUrl, userData, isLoggedin, setIsLoggedin, setUserData } =
    useContext(AppContent);
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/auth/logout");
      if (response.data.success) {
        setIsLoggedin(false);
        setUserData({});
        Cookies.remove("token");
        navigate("/login"); // Programmatic navigation after logout
        toast.success("Successfully logged out!");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during logout. Please try again.");
    }
  };

  return (
    <div className="h-screen w-64 bg-purple-100 shadow-lg p-6 flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-8">
        <img src={logo} alt="Logo" className="h-12 w-12" />
        <h1 className="text-xl font-bold text-black ml-3">YOG-GURU</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        <h2 className="text-gray-600 font-semibold mb-2">MENU</h2>

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-purple-300 text-black font-semibold"
                : "hover:bg-purple-200 text-black"
            }`
          }
        >
          <Home />
          <span>Dashboard Home</span>
        </NavLink>

        <NavLink
          to="/admin/manage-users"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-purple-300 text-black font-semibold"
                : "hover:bg-purple-200 text-black"
            }`
          }
        >
          <Users />
          <span>Manage Users</span>
        </NavLink>

        <NavLink
          to="/admin/manage-classes"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-purple-300 text-black font-semibold"
                : "hover:bg-purple-200 text-black"
            }`
          }
        >
          <Book />
          <span>Manage Classes</span>
        </NavLink>

        <NavLink
          to="/admin/manage-instructors"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-purple-300 text-black font-semibold"
                : "hover:bg-purple-200 text-black"
            }`
          }
        >
          <FileText />
          <span>Applications</span>
        </NavLink>

        {/* Account Section */}
        <h2 className="text-gray-600 font-semibold mt-6 mb-2">ACCOUNT</h2>

        <NavLink
          to="/logout"
          onClick={(e) => {
            e.preventDefault(); // Prevent default NavLink behavior
            handleLogout(); // Call the handleLogout function
          }}
          className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition ${
              isActive
                ? "bg-purple-300 text-black font-semibold"
                : "hover:bg-purple-200 text-black"
            }`
          }
        >
          <LogOut />
          <span>Logout</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;

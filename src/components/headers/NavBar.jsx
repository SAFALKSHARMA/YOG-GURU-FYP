import React, { useEffect, useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContent } from "../../context/AppContext";

const navLinks = [
  { name: "Home", route: "/" },
  { name: "Instructors", route: "/instructors" },
  { name: "Classes", route: "/classes" },
  { name: "Blog", route: "/blog" },
  { name: "Shop", route: "/shop" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHome, setIsHome] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navBg, setNavBg] = useState("bg-[#15151580]");
  const [isFixed, setIsFixed] = useState(false);
  const { backendUrl, userData, isLoggedin, setIsLoggedin, setUserData } =
    useContext(AppContent);
  const user = true;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    setIsHome(location.pathname === "/");
    setIsLogin(location.pathname === "/login");
    setIsFixed(
      location.pathname === "/register" || location.pathname === "/login"
    );
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrollPosition > 100) {
      if (isHome) {
        setNavBg(
          "bg-white backdrop-filter backdrop-blur-x1 bg-opacity-0 dark:text-white text-black"
        );
      } else {
        setNavBg("bg-white dark:bg-black dark:text-white text-black");
      }
    } else {
      setNavBg(
        `${
          isHome || location.pathname === "/"
            ? "bg-transparent"
            : "bg-white dark:bg-black"
        } dark:text-white text-white `
      );
    }
  }, [scrollPosition]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await axios.post(backendUrl + "/api/auth/logout");
      if (response.data.success) {
        setIsLoggedin(false);
        setUserData({}); // Set to empty object instead of null
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

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`${
        isHome ? navBg : "bg-white dark:bg-black backdrop:blur-2x1"
      } ${
        isFixed ? "static" : "fixed"
      } top-0 transition-colors duration-500 ease-in-out w-full z-10`}
    >
      <div className="lg:w-[95%] mx-auto sm:px-6 lg:px-6"></div>

      <div className="px-4 py-4 flex items-center justify-between">
        {/* logo */}
        <div
          onClick={() => navigate("/")}
          className="flex-shrink-0 cursor-pointer pl-7 md:p-0 flex items-center"
        >
          <div>
            <h1 className="text-2xl inline-flex gap-3 items-center font-bold">
              YOG-GURU
              <img src="/images/yoglogo.png" alt="" className="w-8 h-8" />
            </h1>
          </div>
          <p className="font-bold text-[13px] tracking-[8px]">BY YOUR WAY</p>
        </div>

        {/* mobile menu icon */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <FaBars className="h-6 w-6 hover:text-primary" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:block text-black dark:text-white">
          <div className="flex">
            <ul className="ml-10 flex items-center space-x-4 pr-4">
              {navLinks.map((link) => (
                <li key={link.route}>
                  <NavLink
                    to={link.route}
                    style={{ whiteSpace: "nowrap" }}
                    className={({ isActive }) =>
                      `font-bold ${
                        isActive
                          ? "text-secondary"
                          : `${
                              navBg.includes("bg-transparent")
                                ? "text-white"
                                : "text-black dark:text-white"
                            }`
                      } hover:text-secondary duration-300`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}

              {/* based on users */}
              {user ? null : isLogin ? (
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `font-bold ${
                        isActive
                          ? "text-secondary"
                          : `${
                              navBg.includes("bg-transparent")
                                ? "text-white"
                                : "text-black dark:text-white"
                            }`
                      } hover:text-secondary duration-300`
                    }
                  >
                    Log-in
                  </NavLink>
                </li>
              ) : (
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `font-bold ${
                        isActive
                          ? "text-secondary"
                          : `${
                              navBg.includes("bg-transparent")
                                ? "text-white"
                                : "text-black dark:text-white"
                            }`
                      } hover:text-secondary duration-300`
                    }
                  >
                    Log-in
                  </NavLink>
                </li>
              )}

              {/* Conditionally Show Profile Icon or Log In Button */}
              <div className="flex items-center relative">
                {isLoggedin ? (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300 text-lg font-semibold"
                    >
                      {userData && userData.name
                        ? userData.name[0].toUpperCase()
                        : "U"}
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login">
                    <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300">
                      Log In
                    </button>
                  </Link>
                )}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;

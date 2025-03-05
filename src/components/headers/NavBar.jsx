import React, { useEffect, useState, useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars, FaSearch } from "react-icons/fa";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isHome, setIsHome] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [navBg, setNavBg] = useState("bg-white text-black");
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

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-10 ${navBg} transition-colors duration-500 ease-in-out`}
    >
      <div className="lg:w-[95%] mx-auto sm:px-6 lg:px-6"></div>

      <div className="px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex-shrink-0 cursor-pointer pl-7 md:p-0 flex items-center"
        >
          <h1 className="text-2xl font-bold flex items-center gap-3">
            YOG-GURU
            <img src="/images/yoglogo.png" alt="" className="w-8 h-8" />
          </h1>
          <p className="font-bold text-[13px] tracking-[8px]">BY YOUR WAY</p>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-black"
          />
          <FaSearch className="text-black ml-2" />
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-black">
            <FaBars className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:block">
          <ul className="ml-10 flex items-center space-x-4 pr-4">
            {navLinks.map((link) => (
              <li key={link.route}>
                <NavLink
                  to={link.route}
                  className={({ isActive }) =>
                    `font-bold ${
                      isActive ? "text-secondary" : "text-black"
                    } hover:text-secondary duration-300`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}

            {/* User Profile or Login */}
            <div className="flex items-center">
              {isLoggedin ? (
                // Check the user role and conditionally set the link
                <Link
                  to={
                    userData?.role === "instructor"
                      ? "/profile"
                      : userData?.role === "admin"
                      ? "/profile"
                      : "/profile"
                  }
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300 text-lg font-semibold">
                    <img
                      src={userData?.image}
                      alt={userData?.name}
                      className="rounded-full w-full h-full object-cover border-4 border-purple-100"
                    />
                  </div>
                </Link>
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
    </motion.nav>
  );
};

export default NavBar;

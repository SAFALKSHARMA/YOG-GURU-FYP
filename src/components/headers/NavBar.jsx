// NavBar.jsx
import React, { useEffect, useState, useContext } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { motion } from "framer-motion";
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
  const [navBg, setNavBg] = useState("bg-white text-black");
  const { userData, isLoggedin } = useContext(AppContent);

  useEffect(() => {
    const handleScroll = () => {
      setNavBg(
        window.scrollY > 50
          ? "bg-white shadow-md text-black"
          : "bg-white text-black"
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 w-full z-30 ${navBg} transition-colors duration-500 rounded-b-2xl`} // Increased z-index to 30
      >
        <div className="relative max-w-[95%] mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex-shrink-0 cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-3"
          >
            <img src="/images/yoglogo.png" alt="logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold leading-none">YOG-GURU</h1>
              <p className="text-xs font-semibold tracking-[5px]">
                BY YOUR WAY
              </p>
            </div>
          </div>

          {/* Desktop NavLinks */}
          <ul className="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-10">
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
          </ul>

          {/* Profile or Login */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedin ? (
              <Link to="/profile">
                <div className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300">
                  <img
                    src={userData?.image}
                    alt={userData?.name}
                    className="rounded-full w-full h-full object-cover border-2 border-purple-500"
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black"
            >
              <FaBars className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg z-30 p-6 flex flex-col space-y-6"
        >
          {/* Close Sidebar on Link Click */}
          {navLinks.map((link) => (
            <NavLink
              key={link.route}
              to={link.route}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-lg font-semibold ${
                  isActive ? "text-secondary" : "text-black"
                } hover:text-secondary duration-300`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="mt-6">
            {isLoggedin ? (
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300">
                  Profile
                </button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300">
                  Log In
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default NavBar;

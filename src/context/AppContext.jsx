import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = "http://localhost:3000";
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [instructorData, setInstructorData] = useState(null);

  const [loading, setLoading] = useState(true);

  // Configure axios defaults once
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // Single auth check on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
        if (data.success) {
          setIsLoggedin(true);
          await getUserData();
        }
      } catch (error) {
        console.log("Auth check failed:", error.message);
        setIsLoggedin(false);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [backendUrl]);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
        setInstructorData(data.instructorData || null); // Ensure instructorData is set

        setIsLoggedin(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    instructorData,
    setInstructorData,
    setUserData,
    getUserData,
    loading,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};

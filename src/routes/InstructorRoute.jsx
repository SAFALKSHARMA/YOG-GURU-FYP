import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import Loading from "../ui/Loading";

const InstructorRoute = ({ children }) => {
  const { isLoggedin, userData, loading } = useContext(AppContent);

  if (loading) {
    return <Loading text="Checking instructor status..." />;
  }

  if (!isLoggedin || userData?.role !== "instructor") {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default InstructorRoute;

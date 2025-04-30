import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import Loading from "../ui/Loading";

const AdminRoute = ({ children }) => {
  const { isLoggedin, userData, loading } = useContext(AppContent);

  if (loading) {
    return <Loading text="Verifying admin privileges..." />;
  }

  if (!isLoggedin || userData?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import Loading from "../ui/Loading";

const ProtectedRoute = ({ children }) => {
  const { isLoggedin, loading } = useContext(AppContent);

  if (loading) {
    return <Loading text="Checking authentication..." />;
  }

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

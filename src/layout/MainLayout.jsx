import { Outlet } from "react-router-dom";
import NavBar from "../components/headers/NavBar";
const MainLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default MainLayout;

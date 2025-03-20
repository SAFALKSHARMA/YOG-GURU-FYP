import { Outlet } from "react-router-dom";
import NavBar from "../components/headers/NavBar";

const MainLayout = () => {
  return (
    <div>
      {/* <NavBar /> */}
      <div className="mt-16">
        {" "}
        {/* Add margin-top for spacing */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

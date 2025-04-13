import { Outlet } from "react-router-dom";
import NavBar from "../components/headers/NavBar";
import Footer from "../components/headers/Footer";

function MainLayout() {
  return (
    <>
      <NavBar />
      <main style={{ minHeight: "80vh", marginTop: "80px" }}>
        {/* This renders the current page */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;

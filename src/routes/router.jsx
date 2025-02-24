import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Instructors from "../pages/Instructors/Instructors";
import Classes from "../pages/Classes/Classes";
import Blog from "../pages/Blog/Blog";
import Shop from "../pages/Shop/Shop";
import Login from "../components/headers/Login";
import Signup from "../components/headers/Signup";
import EmailVerification from "../components/EmailVerification";
import ForgetPassword from "../components/ForgetPassword";
import Profile from "../components/headers/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // Profile should be inside MainLayout
    children: [
      { path: "/", element: <Home /> },
      { path: "instructors", element: <Instructors /> },
      { path: "classes", element: <Classes /> },
      { path: "blog", element: <Blog /> },
      { path: "shop", element: <Shop /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "email-verification", element: <EmailVerification /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "profile", element: <Profile /> }, // Profile inside MainLayout
    ],
  },
]);

export default router;

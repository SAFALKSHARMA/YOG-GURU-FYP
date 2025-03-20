import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Classes from "../pages/Classes/Classes";
import Blog from "../pages/Blog/Blog";
import Shop from "../pages/Shop/Shop";
import Login from "../components/headers/Login";
import Signup from "../components/headers/Signup";
import EmailVerification from "../components/EmailVerification";
import ForgetPassword from "../components/ForgetPassword";
import Profile from "../profile/Profile";
import InstructorApplicationForm from "../pages/Instructors/ApplyInstructor";
import ManageInstructors from "../Admin/ManageInstructors";
import ManageUsers from "../Admin/ManageUsers";
import AdminDashboard from "../Admin/AdminDashboard";
import InstructorDashboard from "../pages/Instructors/InstructorDashboard";
import ManageClass from "../Admin/manageClass";
import AddClass from "../pages/Instructors/AddClass";
import MyClasses from "../pages/Instructors/MyClasses";
import StudentsList from "../pages/Instructors/StudentsList";
import InstructorsList from "../pages/Instructors/InstructorList";
import ClassDetails from "../pages/Classes/ClassDetails";
import NavBar from "../components/headers/NavBar";
import Footer from "../components/headers/Footer";

function AppRouter() {
  return (
    <Router>
      <NavBar />
      <MainLayout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/class-details/:classId" element={<ClassDetails />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/email-verification" element={<EmailVerification />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/applyInstructor"
          element={<InstructorApplicationForm />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/manage-instructors"
          element={<ManageInstructors />}
        />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-classes" element={<ManageClass />} />

        {/* Instructor Routes (Not Nested) */}
        <Route path="/instructors" element={<InstructorsList />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/add-class" element={<AddClass />} />
        <Route path="/instructor/my-classes" element={<MyClasses />} />
        <Route path="/instructor/students" element={<StudentsList />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRouter;

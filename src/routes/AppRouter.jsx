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
import InstructorDetails from "../pages/Instructors/InstructorDetails/InstructorDetails";
import AdminShop from "../Admin/AdminShop";
import AdminShopList from "../Admin/AdminShopList";
import BookingManagement from "../pages/Instructors/BookingManagement";
import ProductDetail from "../pages/Shop/ProductDetail";
import MyCart from "../pages/Shop/MyCart";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* All pages wrapped inside MainLayout which includes NavBar and Footer */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/class-details/:classId" element={<ClassDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<MyCart />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/forget-password" element={<ForgetPassword />} />

          {/* Instructor Routes */}
          <Route
            path="/applyInstructor"
            element={<InstructorApplicationForm />}
          />
          <Route path="/instructors" element={<InstructorsList />} />
          <Route
            path="/instructor-details/:instructorId"
            element={<InstructorDetails />}
          />
          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          />
          <Route path="/instructor/add-class" element={<AddClass />} />
          <Route path="/instructor/my-classes" element={<MyClasses />} />
          <Route path="/instructor/students" element={<StudentsList />} />
          <Route path="/instructor/bookings" element={<BookingManagement />} />

          {/* Admin Routes */}
          <Route
            path="/admin/manage-instructors"
            element={<ManageInstructors />}
          />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-classes" element={<ManageClass />} />
          <Route path="/admin/manage-shop" element={<AdminShop />} />
          <Route path="/admin/shopList" element={<AdminShopList />} />
        </Route>

        {/* Auth Routes (No Layout) */}
      </Routes>
    </Router>
  );
}

export default AppRouter;

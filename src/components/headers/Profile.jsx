import { useState } from "react";
import {
  Home,
  ClipboardList,
  History,
  UserCheck,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-gray-100 p-5 space-y-6 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 h-screen overflow-y-auto fixed md:sticky top-0 left-0 z-40`}
      >
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">YOG-GURU</div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="space-y-2">
          <button className="flex items-center w-full px-4 py-2 text-white bg-red-500 rounded-lg">
            <Home className="w-5 h-5 mr-2" /> Dashboard
          </button>
          <button className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-200">
            <ClipboardList className="w-5 h-5 mr-2" /> My Enroll
          </button>
          <button className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-200">
            <ClipboardList className="w-5 h-5 mr-2" /> My Selected
          </button>
          <button className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-200">
            <History className="w-5 h-5 mr-2" /> Payment History
          </button>
          <Link to="/applyInstructor">
            <button className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-200">
              <UserCheck className="w-5 h-5 mr-2" /> Apply for Instructor
            </button>
          </Link>
          <button className="flex items-center w-full px-4 py-2 rounded-lg hover:bg-gray-200">
            <Home className="w-5 h-5 mr-2" /> Main Home
          </button>
          <button className="flex items-center w-full px-4 py-2 text-red-500 rounded-lg hover:bg-gray-200">
            <LogOut className="w-5 h-5 mr-2" /> Log-Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-10 overflow-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Open Sidebar Button */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden fixed top-4 left-4 bg-gray-200 p-2 rounded-lg z-50"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <h1 className="text-2xl font-bold">
          Hi, Safal! Welcome to Your Dashboard
        </h1>
        <p className="text-gray-600 text-center max-w-lg mt-2">
          Your dashboard content goes here...
        </p>
        <div className="mt-4 space-x-4">
          <button className="px-4 py-2 border rounded-lg">My Enroll</button>
          <button className="px-4 py-2 border rounded-lg">My Selected</button>
          <button className="px-4 py-2 border rounded-lg">
            Payment History
          </button>
          <button className="px-4 py-2 border rounded-lg">
            Apply for Instructor
          </button>
        </div>
      </main>
    </div>
  );
}

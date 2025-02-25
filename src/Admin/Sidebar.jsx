import {
  Home,
  Users,
  Book,
  FileText,
  LogOut,
  TrendingUp,
  Star,
} from "lucide-react";
// import logo from "../assests/image.png";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-purple-100 shadow-lg p-4">
      <div className="flex items-center justify-center mb-6">
        <img src="image" alt="Logo" className="h-12 w-12" />
        <h1 className="text-xl font-bold text-black ml-2">NayaSathi</h1>
      </div>
      <nav className="space-y-2">
        <h2 className="text-gray-600 font-semibold">MENU</h2>
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-200 cursor-pointer">
          <Home className="text-black" />
          <span className="text-black">Dashboard Home</span>
        </div>
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-200 cursor-pointer">
          <Users className="text-black" />
          <span className="text-black">Manage Users</span>
        </div>
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-200 cursor-pointer bg-purple-300">
          <Book className="text-black" />
          <span className="text-black">Manage Class</span>
        </div>
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-200 cursor-pointer">
          <FileText className="text-black" />
          <span className="text-black">Applications</span>
        </div>
        <h2 className="text-gray-600 font-semibold mt-4">USEFUL LINKS</h2>
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-200 cursor-pointer">
          <Home className="text-black" />
          <span className="text-black">Main Home</span>
        </div>
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-200 cursor-pointer">
          <TrendingUp className="text-black" />
          <span className="text-black">Trending</span>
        </div>
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-200 cursor-pointer">
          <Star className="text-black" />
          <span className="text-black">Following</span>
        </div>
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-purple-200 cursor-pointer">
          <LogOut className="text-black" />
          <span className="text-black">Logout</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;

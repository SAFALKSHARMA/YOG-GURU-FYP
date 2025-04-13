import React from "react";
import { Users, BookOpen, Clock, TrendingUp, Calendar } from "lucide-react";
import Sidebar from "./Sidebar";

const InstructorDashboard = () => {
  const stats = [
    {
      title: "Total Students",
      value: "124",
      icon: <Users className="text-purple-600" size={24} />,
    },
    {
      title: "Active Classes",
      value: "8",
      icon: <BookOpen className="text-purple-600" size={24} />,
    },
    {
      title: "Class Hours",
      value: "32",
      icon: <Clock className="text-purple-600" size={24} />,
    },
    {
      title: "Growth",
      value: "+12%",
      icon: <TrendingUp className="text-purple-600" size={24} />,
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - handles its own responsive behavior */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 lg:ml-8">
        {" "}
        {/* ml-16 accounts for collapsed sidebar */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Dashboard
        </h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-50 rounded-lg">{stat.icon}</div>
              </div>
              <h3 className="text-gray-600 text-sm">{stat.title}</h3>
              <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Classes */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
              Upcoming Classes
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-purple-50 rounded-lg"
                >
                  <Calendar className="text-purple-600 mr-3" size={20} />
                  <div>
                    <h4 className="font-medium text-gray-800">Vinyasa Flow</h4>
                    <p className="text-xs md:text-sm text-gray-600">
                      Today at 10:00 AM • 15 students
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
              Recent Activities
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border-b last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      New student enrolled
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600">
                      Sarah Johnson joined Meditation Basics
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashboard;

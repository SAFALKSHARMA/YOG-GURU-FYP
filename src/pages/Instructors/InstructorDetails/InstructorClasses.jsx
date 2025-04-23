import React from "react";
import { Calendar, Clock, Users, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InstructorClasses({ classes }) {
  const navigate = useNavigate();

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">
          No classes scheduled yet
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-900 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-purple-700" />
          Upcoming Classes
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {classes.map((classItem) => (
          <div
            key={classItem._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={classItem.image}
                alt={classItem.className}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-medium">
                  {classItem.className}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm">
                    {new Date(classItem.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm">{classItem.time}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm">{classItem.duration} minutes</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm">
                    {classItem.capacity} spots available
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-semibold text-purple-800">
                    ₹{classItem.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ session</span>
                </div>
                <button
                  onClick={() => navigate(`/class-details/${classItem._id}`)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-purple-200"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructorClasses;

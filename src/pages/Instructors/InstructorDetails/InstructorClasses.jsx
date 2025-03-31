import React from "react";
import { Calendar, Clock, Users, Bookmark } from "lucide-react";

function InstructorClasses({ classes }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-900 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-purple-700" />
          Upcoming Classes
        </h2>
        <div className="flex gap-2">
          <button className="bg-white text-purple-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:border-purple-300 transition-colors shadow-sm">
            Filter
          </button>
          <button className="bg-white text-purple-700 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:border-purple-300 transition-colors shadow-sm">
            Sort
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {classes.map((class_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group"
          >
            <div className="relative">
              <img
                src={class_.image}
                alt={class_.className}
                className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {class_.difficultyLevel}
                    </span>
                    <button className="text-white hover:text-purple-300 transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                {class_.className}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {class_.description}
              </p>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm">
                    {new Date(class_.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm">{class_.time}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Users className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm">
                    {class_.capacity} students max
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm">{class_.totalDuration}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-semibold text-purple-800">
                    ${class_.price}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ person</span>
                </div>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-purple-200">
                  Enroll Now
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

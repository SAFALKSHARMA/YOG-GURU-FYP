// EnrolledYogaClasses.js
import React from "react";
import { Calendar, Smile } from "lucide-react";

const EnrolledClasses = ({ enrolledClasses = [] }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          My Enrolled Yoga Classes
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Your journey to mindfulness and well-being.
        </p>
      </div>

      <div className="px-6 py-5">
        {Array.isArray(enrolledClasses) && enrolledClasses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledClasses.map((yogaClass) => (
              <div
                key={yogaClass.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-48 w-full relative">
                  <img
                    src={yogaClass.image}
                    alt={yogaClass.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {yogaClass.name}
                  </h4>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-2">{yogaClass.instructor}</span>
                    <span>•</span>
                    <span className="mx-2">{yogaClass.level}</span>
                    <span>•</span>
                    <span className="ml-2">{yogaClass.type}</span>
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      Starts on {yogaClass.startDate}
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700">
                      View Details
                    </button>
                    <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Smile className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No enrolled yoga classes yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Find the perfect yoga class and begin your journey today.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700">
                Browse Classes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledClasses;

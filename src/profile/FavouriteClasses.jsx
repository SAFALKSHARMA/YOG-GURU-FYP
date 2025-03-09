// FavoriteYogaClasses.js
import React from "react";
import { Heart } from "lucide-react";

const FavoriteClasses = ({ favoriteClasses = [] }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Favorite Yoga Classes
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Classes you've saved to join later.
        </p>
      </div>

      <div className="px-6 py-5">
        {Array.isArray(favoriteClasses) && favoriteClasses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteClasses.map((yogaClass) => (
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
                  <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white text-red-500 hover:bg-red-50">
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {yogaClass.name}
                    </h4>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {yogaClass.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-2">{yogaClass.instructor}</span>
                    <span>•</span>
                    <span className="mx-2">{yogaClass.level}</span>
                    <span>•</span>
                    <span className="ml-2">{yogaClass.type}</span>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700">
                      View Details
                    </button>
                    <button className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No favorite yoga classes yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Save yoga classes you're interested in to your favorites list.
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

export default FavoriteClasses;

import React, { useEffect, useState } from "react";
import { Clock, Users as UsersIcon, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../ui/button";

const PopularClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/classes/all-classes"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }

        const data = await response.json();
        if (data.success && data.classes) {
          // Filter approved classes with capacity and sort by popularity/featured
          const availableClasses = data.classes
            .filter((cls) => cls?.status === "Approved" && cls?.capacity > 0)
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 4); // Get top 4 popular classes
          setClasses(availableClasses);
        } else {
          throw new Error("Invalid data format from server");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const toggleFavorite = (classId) => {
    setFavorites((prev) => ({
      ...prev,
      [classId]: !prev[classId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading featured classes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 text-red-500">
            <div className="w-8 h-8 border-2 border-red-500 rounded-full flex items-center justify-center">
              <span className="text-xl">!</span>
            </div>
          </div>
          <p className="text-lg text-gray-800 mb-2">Unable to load classes</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 text-center">Our Classes</h2>
        </header>

        {classes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="mx-auto mb-4 text-gray-400">
              <Calendar size={32} />
            </div>
            <p className="text-lg text-gray-800">No classes available</p>
            <p className="text-gray-600 mt-1">
              Check back later for new schedules
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {classes.map((yogaClass) => (
                <div
                  key={yogaClass._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <div className="relative">
                    <img
                      src={yogaClass.image}
                      alt={yogaClass.className}
                      className="w-full h-48 object-cover"
                    />

                    {yogaClass.popularity > 50 && (
                      <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Popular
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {yogaClass.className}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          yogaClass.difficultyLevel === "beginner"
                            ? "bg-green-100 text-green-800"
                            : yogaClass.difficultyLevel === "intermediate"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {yogaClass.difficultyLevel}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {yogaClass.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 text-purple-600 mr-1" />
                        {yogaClass.duration} min
                      </div>
                      <div className="flex items-center text-gray-600">
                        <UsersIcon className="h-4 w-4 text-purple-600 mr-1" />
                        {yogaClass.capacity} spots
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 text-purple-600 mr-1" />
                        {yogaClass.schedule}
                      </div>
                      <div className="flex items-center font-semibold text-purple-600">
                        ${yogaClass.price}
                      </div>
                    </div>

                    <Link
                      to={`/class-details/${yogaClass._id}`}
                      className="block w-full"
                    >
                      <Button
                        text="View Class"
                        className="w-full hover:bg-purple-700"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                to="/classes"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Veiw All
                <svg
                  className="ml-2 -mr-1 w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PopularClasses;

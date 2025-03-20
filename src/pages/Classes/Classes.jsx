import React, { useEffect, useState } from "react";
import { Clock, MapPin, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/classes/all-classes"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        console.log("Fetched Classes:", data);
        setClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <p className="text-center">Loading classes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const handleClick = (yogaClass) => {
    console.log("Selected Class:", yogaClass);
    navigate(`/class-details/${yogaClass._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Available Classes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {classes.map((yogaClass) => (
          <div
            key={yogaClass._id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="relative h-40">
              <img
                src={yogaClass.image}
                alt={yogaClass.className}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 bg-white text-purple-600 px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                {yogaClass.difficultyLevel}
              </div>
              <div className="absolute bottom-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                Rs. {yogaClass.price}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                {yogaClass.className}
              </h3>
              <p className="text-xs text-gray-600">{yogaClass.description}</p>

              <div className="space-y-1.5 mb-3 mt-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  {yogaClass.time}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  {yogaClass.capacity} spots available
                </div>
              </div>

              <button
                onClick={() => handleClick(yogaClass)}
                className="w-full bg-purple-50 text-purple-600 hover:bg-purple-100 py-1.5 px-3 rounded-md text-sm font-medium flex items-center justify-center transition-colors duration-200"
              >
                Book Class
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;

import React, { useEffect, useState } from "react";
import ClassCard from "../../ui/ClassCard";
import { Link } from "react-router-dom";

const PopularClasses = () => {
  const [allClasses, setAllClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  const userId = "user-id-here"; // Replace with actual userId

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
        setAllClasses(data);

        // Filter classes where capacity > 0
        const availableClasses = data.filter((cls) => cls && cls.capacity > 0);
        setFilteredClasses(availableClasses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const toggleFavorite = (yogaClass) => {
    setFavorites((prev) => ({
      ...prev,
      [yogaClass._id]: !prev[yogaClass._id],
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Loading classes...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading classes: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-5xl font-bold mb-6 text-center">Our Classes</h2>

      {filteredClasses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg">No classes available at the moment</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.map((yogaClass) => (
              <ClassCard
                key={yogaClass._id || Math.random().toString()}
                yogaClass={yogaClass}
                isFavorite={favorites[yogaClass._id]}
                toggleFavorite={toggleFavorite}
                userId={userId}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/classes"
              className="inline-block px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-300"
            >
              See More Classes
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default PopularClasses;

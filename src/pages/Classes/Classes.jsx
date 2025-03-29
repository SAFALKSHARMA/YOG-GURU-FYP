import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassCard from "../../ui/ClassCard";
import FavouriteIcon from "../../ui/FavouriteIcon";

const Classes = () => {
  const [classes, setClasses] = useState([]);
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
        setClasses(data);
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

  if (loading) return <p className="text-center">Loading classes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Available Classes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.map((yogaClass) => (
          <ClassCard
            key={yogaClass._id}
            yogaClass={yogaClass}
            isFavorite={favorites[yogaClass._id]}
            toggleFavorite={toggleFavorite}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
};

export default Classes;

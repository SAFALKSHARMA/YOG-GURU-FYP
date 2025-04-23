import React, { useContext, useEffect, useState } from "react";
import { Heart, Loader2, AlertCircle } from "lucide-react";
import { AppContent } from "../context/AppContext";
import ClassCard from "../ui/ClassCard";
import { useNavigate } from "react-router-dom";

const FavoriteClasses = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [favoriteClasses, setFavoriteClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch favorite classes
  useEffect(() => {
    const fetchFavoriteClasses = async () => {
      try {
        const userId = userData?.userId;

        if (!userId) {
          setLoading(false);
          setError("Please login to view your favorite classes");
          return;
        }

        setLoading(true);
        setError(null);

        const response = await fetch(
          `${backendUrl}/api/classes/${userId}/favorites`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "No favorite classes found"
              : "Failed to fetch favorites"
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Error fetching favorites");
        }

        setFavoriteClasses(data.favoriteClasses || []);
      } catch (error) {
        console.error("Error fetching favorite classes:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteClasses();
  }, [userData, backendUrl]);

  const handleBrowseClasses = () => {
    navigate("/classes");
  };

  const handleRemoveFavorite = async (classId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/classes/${userData.userId}/favorites/${classId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      // Update local state to remove the class
      setFavoriteClasses((prev) => prev.filter((cls) => cls._id !== classId));
    } catch (error) {
      console.error("Error removing favorite:", error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
        <span className="ml-3 text-gray-600">Loading your favorites...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 text-center max-w-md mx-auto border border-gray-100">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <div className="text-gray-700 mb-4">{error}</div>
        {error === "Please login to view your favorite classes" ? (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all"
          >
            Login
          </button>
        ) : (
          <div className="space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={handleBrowseClasses}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all"
            >
              Browse Classes
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
      <div className="px-6 py-5 bg-indigo-500">
        <div className="flex items-center">
          <div className="p-2 mr-4 bg-white bg-opacity-20 rounded-lg">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              Your Favorite Yoga Classes
            </h3>
            <p className="text-sm text-indigo-100 mt-1">
              Classes you've saved to join later
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {favoriteClasses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteClasses.map((yogaClass) => (
              <ClassCard
                key={yogaClass._id}
                yogaClass={yogaClass}
                isFavorite={true}
                toggleFavorite={() => handleRemoveFavorite(yogaClass._id)}
                userId={userData?.userId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No favorite classes yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Save classes you're interested in by clicking the heart icon
            </p>
            <div className="mt-6">
              <button
                onClick={handleBrowseClasses}
                className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-all"
              >
                Browse Available Classes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteClasses;

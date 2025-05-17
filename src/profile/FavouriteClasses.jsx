import React, { useContext, useEffect, useState } from "react";
import { Heart, Loader2, AlertCircle, Search } from "lucide-react";
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
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
          <span className="mt-4 text-gray-600 font-medium">
            Loading your favorites...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-red-50 rounded-full mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Favorites
          </h3>
          <p className="text-gray-600 mb-6 text-center">{error}</p>

          {error === "Please login to view your favorite classes" ? (
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-sm w-full font-medium"
            >
              Login to Your Account
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-sm font-medium flex-1"
              >
                Try Again
              </button>
              <button
                onClick={handleBrowseClasses}
                className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium flex-1"
              >
                Browse Classes
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto">
      {/* Modern header with action */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Your Favorite Classes
            </h2>
            <p className="text-sm text-gray-500">
              Yoga sessions you've saved to join later
            </p>
          </div>
        </div>

        <button
          onClick={handleBrowseClasses}
          className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all shadow-sm"
        >
          <Search className="mr-2 h-4 w-4" />
          Discover More
        </button>
      </div>

      {/* Content area */}
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
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="p-4 bg-indigo-50 rounded-full inline-flex mx-auto mb-4">
            <Heart className="h-12 w-12 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Favorite Classes Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Save yoga classes you're interested in by clicking the heart icon.
            Your favorites will appear here for easy access.
          </p>
          <button
            onClick={handleBrowseClasses}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-sm font-medium"
          >
            Browse Available Classes
          </button>
        </div>
      )}
    </section>
  );
};

export default FavoriteClasses;

import React, { useContext, useEffect, useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { AppContent } from "../context/AppContext";
import ClassCard from "../ui/ClassCard";
import { useNavigate } from "react-router-dom";

// API endpoints
const FAVORITES_API_URL = "http://localhost:3000/api/classes";
const CLASS_DETAILS_API_URL = "http://localhost:3000/api/classes"; // Base URL for fetching class details

const FavoriteClasses = () => {
  const { userData } = useContext(AppContent);
  const [favoriteClassIds, setFavoriteClassIds] = useState([]);
  const [favoriteClasses, setFavoriteClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch favorite class IDs
  useEffect(() => {
    const fetchFavoriteClassIds = async () => {
      try {
        const userId = userData?.userId;
        console.log("Fetching favorites for userId:", userId);

        if (!userId) {
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const response = await fetch(
          `${FAVORITES_API_URL}/${userId}/favorites`
        );
        console.log("API Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "User not found"
              : "Failed to fetch favorites"
          );
        }

        const data = await response.json();
        console.log("API Response Data:", data);

        if (!data.success) {
          throw new Error(data.message || "Error fetching favorites");
        }

        console.log("Favorite class IDs received:", data.favoriteClassIds);
        setFavoriteClassIds(data.favoriteClassIds || []);
      } catch (error) {
        console.error("Error fetching favorite class IDs:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteClassIds();
  }, [userData]);

  // Fetch class details using the IDs
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        const classDetailsPromises = favoriteClassIds.map(async (classId) => {
          const response = await fetch(`${CLASS_DETAILS_API_URL}/${classId}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch class details for ${classId}`);
          }
          return response.json();
        });

        const classDetails = await Promise.all(classDetailsPromises);
        console.log("Fetched class details:", classDetails);
        setFavoriteClasses(classDetails);
      } catch (error) {
        console.error("Error fetching class details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (favoriteClassIds.length > 0) {
      fetchClassDetails();
    }
  }, [favoriteClassIds]);

  const handleBrowseClasses = () => {
    navigate("/classes");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  console.log("Rendering favorite classes with details:", favoriteClasses);

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
        {favoriteClasses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteClasses.map((yogaClass) => (
              <ClassCard
                key={yogaClass._id}
                yogaClass={yogaClass}
                showFavoriteButton={false} // Assuming your ClassCard has this prop
              />
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
              <button
                onClick={handleBrowseClasses}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
              >
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

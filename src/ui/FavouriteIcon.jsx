import { useContext, useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { AppContent } from "../context/AppContext";
import { message } from "antd";

const FavouriteIcon = ({ yogaClass }) => {
  const [isFavourited, setIsFavourited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animating, setIsAnimating] = useState(false);
  const { userData, setUserData } = useContext(AppContent);

  const classId = yogaClass._id;

  useEffect(() => {
    // More robust check for favorite status
    if (userData?.favoriteClasses && classId) {
      const isFav = userData.favoriteClasses.some((favId) => {
        // Handle both string and ObjectId cases
        const favIdStr = favId.toString ? favId.toString() : favId;
        const classIdStr = classId.toString ? classId.toString() : classId;
        return favIdStr === classIdStr;
      });
      setIsFavourited(isFav);
    } else {
      setIsFavourited(false);
    }
  }, [userData, classId]);

  const toggleFavourite = async () => {
    if (!userData?.userId) {
      message.warning("Please login to add to favorites");
      return;
    }

    setLoading(true);
    setIsAnimating(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/classes/toggle-favorite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userData.userId,
            classId: classId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update both local state and context
        setIsFavourited(data.isFavorite);

        setUserData((prev) => {
          const newFavorites = data.isFavorite
            ? [...(prev.favoriteClasses || []), classId]
            : (prev.favoriteClasses || []).filter(
                (id) =>
                  (id.toString ? id.toString() : id) !==
                  (classId.toString ? classId.toString() : classId)
              );

          const newUserData = {
            ...prev,
            favoriteClasses: newFavorites,
          };

          return newUserData;
        });

        message.success(data.message);
      } else {
        message.error(data.message || "Failed to toggle favorite");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      message.error("Error updating favorite. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavourite();
      }}
      className={`p-2 rounded-full shadow-md hover:scale-110 transition-all duration-300 ${
        isFavourited ? "text-red-500" : "text-gray-400"
      } ${animating ? "animate-pop" : ""} ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={loading}
      aria-label={isFavourited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={22}
        strokeWidth={isFavourited ? 2.5 : 2}
        fill={isFavourited ? "currentColor" : "none"}
      />
    </button>
  );
};

export default FavouriteIcon;

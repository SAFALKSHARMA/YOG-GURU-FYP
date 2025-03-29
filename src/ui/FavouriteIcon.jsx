import React, { useContext, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { AppContent } from "../context/AppContext";

const FavouriteIcon = ({ yogaClass }) => {
  const { userData } = useContext(AppContent);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
    if (!userData?.userId || !yogaClass?._id) {
      console.error("Missing required data");
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        userId: userData.userId,
        classId: yogaClass._id,
      };
      console.log("Sending request to toggle favorite:", requestData);

      const response = await fetch(
        "http://localhost:3000/api/classes/toggle-favorites",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const data = await response.json();
      console.log("Response received:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to toggle favorite");
      }
      setIsFavorite(data.isFavorite);
      console.log("Updated favorite status:", data.isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={toggleFavorite}
      disabled={isLoading}
      whileTap={{ scale: 0.8 }}
      className={`absolute top-2 right-2 p-2 rounded-full shadow-sm bg-white transition-colors duration-300 ${
        isFavorite ? "text-red-500" : "text-gray-400"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isLoading ? (
        <span className="loading-spinner h-5 w-5 border-2 border-gray-400 rounded-full animate-spin" />
      ) : (
        <Heart
          className="h-5 w-5"
          fill={isFavorite ? "currentColor" : "none"}
          strokeWidth={2}
        />
      )}
    </motion.button>
  );
};

export default FavouriteIcon;

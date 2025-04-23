import React from "react";
import {
  Clock,
  Users,
  Calendar,
  ChevronRight,
  Heart,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClassCard = ({
  yogaClass,
  isFavorite,
  toggleFavorite,
  userId,
  showEnrolledStatus = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/class-details/${yogaClass._id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (toggleFavorite) {
      toggleFavorite(yogaClass._id);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-44">
        <img
          src={yogaClass.image || "https://via.placeholder.com/300"}
          alt={yogaClass.className}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2 bg-white text-purple-600 px-2 py-1 rounded-full text-xs font-semibold shadow-md">
          {yogaClass.difficultyLevel}
        </div>

        {/* Show enrolled status if enabled */}
        {showEnrolledStatus && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            <span>Enrolled</span>
          </div>
        )}

        {/* Favorite button (only shown if toggleFavorite is provided) */}
        {toggleFavorite && userId && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isFavorite ? "text-red-500 bg-white" : "text-gray-400 bg-white"
            }`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className="h-5 w-5"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {yogaClass.className}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
          <span>
            {new Date(yogaClass.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex justify-between items-center rounded-md mb-2">
          <div className="text-sm text-gray-700 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-purple-600" />
            <span>{yogaClass.time}</span>
          </div>
          <span className="text-sm font-medium text-white bg-purple-600 px-3 py-1 rounded-full">
            ₹{yogaClass.price.toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <span className="font-medium">Duration:</span>{" "}
          {yogaClass.totalDuration}
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Users className="h-4 w-4 mr-2 text-purple-600" />
          <span>
            {yogaClass.capacity > 0
              ? `${yogaClass.capacity} spots available`
              : "Class full"}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full bg-purple-50 text-purple-600 hover:bg-purple-100 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center transition-colors duration-200"
          disabled={yogaClass.capacity <= 0 && !showEnrolledStatus}
        >
          {showEnrolledStatus
            ? "View Class"
            : yogaClass.capacity > 0
            ? "View Details"
            : "Waitlist"}
          <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ClassCard;

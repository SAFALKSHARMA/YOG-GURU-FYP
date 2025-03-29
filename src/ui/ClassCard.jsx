import React from "react";
import { Clock, Users, Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FavouriteIcon from "./FavouriteIcon";

const ClassCard = ({ yogaClass, isFavorite, toggleFavorite, userId }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/class-details/${yogaClass._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
      <div className="relative h-44">
        <img
          src={yogaClass.image}
          alt={yogaClass.className}
          className="w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2 bg-white text-purple-600 px-2 py-1 rounded-full text-xs font-semibold shadow-md">
          {yogaClass.difficultyLevel}
        </div>
        <FavouriteIcon
          isFavorite={isFavorite}
          onClick={() => toggleFavorite(yogaClass)}
          yogaClass={yogaClass}
          userId={userId}
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {yogaClass.className}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
          <span>
            Start Date: {new Date(yogaClass.date).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between items-center rounded-md mb-2">
          <div className="text-sm text-gray-700 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-purple-600" />
            <span>{yogaClass.time}</span>
          </div>
          <span className="text-sm font-medium text-white bg-purple-600 p-2 rounded-2xl">
            Rs. {yogaClass.price}
          </span>
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <span className="font-medium">Duration:</span>{" "}
          {yogaClass.totalDuration}
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Users className="h-4 w-4 mr-2 text-purple-600" />
          {yogaClass.capacity} spots available
        </div>
        <button
          onClick={handleClick}
          className="w-full bg-purple-50 text-purple-600 hover:bg-purple-100 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center transition-colors duration-200"
        >
          Book Class
          <ChevronRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ClassCard;

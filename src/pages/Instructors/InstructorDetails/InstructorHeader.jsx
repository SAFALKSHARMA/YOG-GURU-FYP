import React, { useState } from "react";
import {
  Award,
  Mail,
  Phone,
  MapPin,
  Heart,
  Share2,
  Star,
  Calendar,
} from "lucide-react";
import YogaBookingModal from "./YogaBookingModal"; // Import the YogaBookingModal component

function InstructorHeader({
  instructor,
  favorite,
  setFavorite,
  activeTab,
  setActiveTab,
}) {
  // Add state to control the booking modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Function to open the booking modal
  const openBookingModal = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white relative overflow-hidden">
      {/* Abstract Shapes Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-purple-400"></div>
        <div className="absolute top-40 right-20 w-64 h-64 rounded-full bg-indigo-400"></div>
        <div className="absolute bottom-10 left-1/3 w-32 h-32 rounded-full bg-pink-400"></div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Instructor Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl transform transition-all duration-300 group-hover:scale-105">
              <img
                src={instructor.image}
                alt={instructor.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Instructor Details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                {instructor.fullName}
              </h1>
              <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-300 fill-current"
                    />
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start mb-4">
              <Award className="w-5 h-5 mr-2 text-purple-300" />
              <p className="text-purple-200">
                {instructor.experience}+ years Teaching Experience
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-start mb-4">
              <MapPin className="w-5 h-5 mr-2 text-purple-300" />
              <p className="text-purple-200">New York, NY</p>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-purple-300" />
                <span className="text-sm">{instructor.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-purple-300" />
                <span className="text-sm">{instructor.phone}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button className="bg-white text-purple-700 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-purple-200">
                Book a Class
              </button>
              <button
                onClick={openBookingModal}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-pink-200/50 flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </button>
              <button className="bg-purple-600/30 backdrop-blur-sm text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-600/50 transition-all duration-300 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex space-x-1 bg-white/10 backdrop-blur-md p-1 rounded-t-xl max-w-lg mx-auto md:mx-0">
          <button
            onClick={() => setActiveTab("classes")}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm ${
              activeTab === "classes"
                ? "bg-white text-purple-700"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            Classes
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm ${
              activeTab === "about"
                ? "bg-white text-purple-700"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 px-4 py-3 rounded-lg font-medium text-sm ${
              activeTab === "reviews"
                ? "bg-white text-purple-700"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Render the YogaBookingModal conditionally */}
      <YogaBookingModal
        isOpen={isBookingModalOpen}
        setIsOpen={setIsBookingModalOpen}
      />
    </div>
  );
}

export default InstructorHeader;

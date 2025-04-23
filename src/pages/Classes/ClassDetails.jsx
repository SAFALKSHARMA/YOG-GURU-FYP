import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Clock,
  Calendar,
  Users,
  Timer,
  ChevronLeft,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { AppContent } from "../../context/AppContext";

function ClassDetails() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(AppContent);
  const [enrollmentError, setEnrollmentError] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch class details
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/classes/${classId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch class details");
        }

        const data = await response.json();

        if (data.success && data.class) {
          setClassData(data.class);
        } else {
          throw new Error("Invalid class data format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId]);

  // Enroll user in class
  const handleEnroll = async () => {
    if (!userData) {
      setEnrollmentError("Please login to enroll in this class");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (!classData) return;

    setIsEnrolling(true);
    setEnrollmentError("");
    setEnrollmentSuccess(false);

    try {
      const response = await fetch("http://localhost:3000/api/classes/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData.userId,
          fullName: userData.name,
          email: userData.email,
          image: userData.image,
          classId: classId,
          instructorId: classData.instructor._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to enroll in the class");
      }

      const result = await response.json();
      setEnrollmentSuccess(true);
      // Update class data to reflect the enrollment
      setClassData((prev) => ({
        ...prev,
        capacity: prev.capacity - 1,
        students: [...(prev.students || []), userData.userId],
      }));
    } catch (err) {
      setEnrollmentError(err.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Error Loading Class
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/classes"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-block"
          >
            Back to Classes
          </Link>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700">Class not found</p>
          <Link
            to="/classes"
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-block"
          >
            Browse Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Back button */}
        <div className="mb-6 md:mb-8">
          <Link
            to="/classes"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 group transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Classes</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Column - Image */}
            <div className="relative h-64 md:h-auto">
              <img
                src={classData.image}
                alt={classData.className}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-white/90 text-purple-800 text-xs font-semibold rounded-full">
                    {classData.difficultyLevel} Level
                  </span>
                </div>
                <h1 className="text-white text-2xl font-bold mt-2 text-center">
                  {classData.className}
                </h1>
                <div className="flex items-center justify-center text-white/90 text-sm mt-2">
                  <User className="w-4 h-4 mr-2" />
                  <span>Instructor: {classData.instructor.fullName}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">
                    About This Class
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {classData.description || "No description available."}
                  </p>
                </div>

                {/* Class Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(classData.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">
                        {classData.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Timer className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">
                        {classData.duration} minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Available Spots</p>
                      <p className="font-medium text-gray-900">
                        {classData.capacity > 0 ? classData.capacity : "Full"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price and Enrollment */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Total Duration</p>
                      <p className="font-medium text-gray-900">
                        {classData.totalDuration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-2xl font-bold text-purple-600">
                        ₹{classData.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {enrollmentError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <p>{enrollmentError}</p>
                    </div>
                  )}

                  {enrollmentSuccess && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <p>Successfully enrolled in this class!</p>
                    </div>
                  )}

                  <button
                    onClick={handleEnroll}
                    disabled={
                      isEnrolling ||
                      classData.capacity <= 0 ||
                      enrollmentSuccess
                    }
                    className={`w-full py-3 rounded-lg flex items-center justify-center transition-colors ${
                      isEnrolling ||
                      classData.capacity <= 0 ||
                      enrollmentSuccess
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {isEnrolling ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : enrollmentSuccess ? (
                      "Enrolled Successfully"
                    ) : classData.capacity <= 0 ? (
                      "Class Full"
                    ) : (
                      "Enroll Now"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassDetails;

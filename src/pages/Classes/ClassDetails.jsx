import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  Calendar,
  Users,
  Timer,
  ChevronLeft,
  ArrowRight,
  User,
} from "lucide-react";
import { AppContent } from "../../context/AppContext";

function ClassDetails() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useContext(AppContent); // User data context
  const [enrollmentError, setEnrollmentError] = useState("");

  // Fetch class details
  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/classes/${classId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch class details");
        }
        const data = await response.json();
        setClassData(data);
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
      setError("User not found. Please login first.");
      return;
    }

    // Log userId and classId
    console.log("User ID:", userData?.userId);
    console.log("Class ID:", classId);

    try {
      const response = await fetch("http://localhost:3000/api/classes/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.userId, // User ID
          classId: classId, // Class ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to enroll in the class");
      }

      const result = await response.json();
      alert("Successfully enrolled in the class!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center">Loading class details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!classData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <Link to="/classes">
          <button className="flex items-center text-gray-500 hover:text-gray-900 mb-8 group">
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Classes</span>
          </button>
        </Link>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative">
              <img
                src={classData.image}
                alt={classData.className}
                className="w-full h-full object-cover"
              />

              <div className="absolute bottom-5 left-0 right-0 p-2 backdrop-blur-sm bg-white/50 shadow-lg">
                <div className="flex text-black text-sm font-medium mb-2 justify-center">
                  {classData.difficultyLevel} Level
                </div>
                <h1 className="text-black text-2xl font-semibold mb-2 text-center">
                  {classData.className}
                </h1>
                <div className="flex items-center text-black text-sm mb-2 justify-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>By: {classData.instructorFullName}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="p-8">
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">
                    About This Class
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {classData.description}
                  </p>
                </div>

                {/* Class Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(classData.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-medium text-gray-900">
                          {classData.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium text-gray-900">
                          {classData.duration} minutes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">Class Size</p>
                        <p className="font-medium text-gray-900">
                          {classData.capacity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Enrollment */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Duration</p>
                      <p className="font-medium text-gray-900">
                        {classData.totalDuration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-2xl font-light text-purple-600">
                        Rs. {classData.price}
                      </p>
                    </div>
                  </div>

                  {enrollmentError && (
                    <p className="text-red-500 text-center">
                      {enrollmentError}
                    </p>
                  )}

                  <button
                    onClick={handleEnroll}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center group"
                  >
                    Enroll Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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

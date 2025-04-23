import React, { useContext, useEffect, useState } from "react";
import { BookOpen, Smile, Loader2, AlertCircle } from "lucide-react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import ClassCard from "../ui/ClassCard";

const EnrolledClasses = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      try {
        if (!userData?.userId) {
          setError("Please login to view enrolled classes");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        // Fetch enrolled classes directly from the API endpoint
        const response = await fetch(
          `${backendUrl}/api/classes/${userData.userId}/enrolled-classes`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "No enrolled classes found"
              : "Failed to fetch enrolled classes"
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Error fetching enrolled classes");
        }

        // Assuming the API returns an array of class objects directly
        setEnrolledClasses(data.enrolledClasses || []);
      } catch (err) {
        console.error("Error fetching enrolled classes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledClasses();
  }, [userData, backendUrl]);

  const handleBrowseClasses = () => {
    navigate("/classes");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
        <span className="ml-3 text-gray-600">Loading your classes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 text-center max-w-md mx-auto border border-gray-100">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <div className="text-gray-700 mb-4">{error}</div>
        {error === "Please login to view enrolled classes" ? (
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
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              My Enrolled Yoga Classes
            </h3>
            <p className="text-sm text-indigo-100 mt-1">
              Your journey to mindfulness and well-being
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {enrolledClasses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledClasses.map((yogaClass) => (
              <ClassCard
                key={yogaClass._id}
                yogaClass={yogaClass}
                isFavorite={false}
                toggleFavorite={null}
                userId={userData?.userId}
                showEnrolledStatus={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Smile className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No enrolled classes yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Find the perfect yoga class and begin your journey today
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

export default EnrolledClasses;

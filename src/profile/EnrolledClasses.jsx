import React, { useContext, useEffect, useState } from "react";
import { Calendar, Smile } from "lucide-react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EnrolledClasses = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      try {
        // Fetch enrolled class IDs from the user's API endpoint
        const response = await axios.get(
          `${backendUrl}/api/classes/${userData.userId}/enrolled-classes`,
          { withCredentials: true }
        );

        const classIds = response.data; // Class IDs are already in the response as an array

        console.log("Extracted class IDs:", classIds);

        // Fetch class details for each classId
        const classDetailsPromises = classIds.map(async (classId) => {
          try {
            const classResponse = await axios.get(
              `${backendUrl}/api/classes/${classId}`,
              { withCredentials: true }
            );
            return classResponse.data; // Assuming response contains the class details as 'class'
          } catch (err) {
            console.error(
              `Error fetching class details for ${classId}:`,
              err.message
            );
            return null;
          }
        });

        const classDetails = await Promise.all(classDetailsPromises);

        // Log the raw class details
        console.log("Class details before filtering:", classDetails);

        // Filter out invalid or null class details
        const validClassDetails = classDetails.filter(
          (classDetail) => classDetail && classDetail._id
        );

        console.log("Valid class details:", validClassDetails);

        setEnrolledClasses(validClassDetails);
      } catch (err) {
        console.error(
          "Error fetching enrolled classes:",
          err.response?.data || err.message
        );
        setError(err.response?.data?.message || err.message);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden p-6 text-center">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          My Enrolled Yoga Classes
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Your journey to mindfulness and well-being.
        </p>
      </div>

      <div className="px-6 py-5">
        {enrolledClasses.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledClasses.map((yogaClass) => (
              <div
                key={yogaClass._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-48 w-full relative">
                  <img
                    src={yogaClass.image || "https://via.placeholder.com/300"} // Fallback to placeholder if image is missing
                    alt={yogaClass.className}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {yogaClass.className}
                  </h4>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="mr-2">
                      {yogaClass.instructorFullName || "Unknown Instructor"}
                    </span>
                    <span>•</span>
                    <span className="mx-2">{yogaClass.difficultyLevel}</span>
                    {/* <span>•</span>
                    <span className="ml-2">{yogaClass.classLink}</span> */}
                  </div>
                  <div className="mt-3 flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(yogaClass.date).toLocaleDateString()} at{" "}
                      {yogaClass.time}
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() =>
                        navigate(`/class-details/${yogaClass._id}`)
                      }
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Smile className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No enrolled yoga classes yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Find the perfect yoga class and begin your journey today.
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

export default EnrolledClasses;

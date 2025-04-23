import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InstructorHeader from "./InstructorHeader";
import InstructorClasses from "./InstructorClasses";
import InstructorAbout from "./InstructorAbout";

function InstructorDetails() {
  const { instructorId } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const fetchInstructorData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/instructors/${instructorId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch instructor data");
        }

        const data = await response.json();
        setInstructor(data);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [instructorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-purple-200 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-purple-800 text-lg font-medium">
            Loading instructor profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="text-center p-10 max-w-md rounded-2xl bg-white shadow-xl">
          <div className="text-red-500 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-purple-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="text-center p-10 max-w-md rounded-2xl bg-white shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Instructor Not Found
          </h2>
          <p className="text-gray-600">
            The instructor you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-50 to-indigo-50">
      <InstructorHeader
        instructor={instructor}
        favorite={favorite}
        setFavorite={setFavorite}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        instructorId={instructorId}
      />

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {activeTab === "classes" && (
          <InstructorClasses classes={instructor.classes || []} />
        )}
        {activeTab === "about" && <InstructorAbout instructor={instructor} />}
      </div>
    </div>
  );
}

export default InstructorDetails;

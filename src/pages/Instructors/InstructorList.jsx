import React, { useEffect, useState } from "react";
import { Star, Award, Calendar, Users, Mail, Phone } from "lucide-react";

const InstructorsList = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/instructors/all-instructors"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch instructors");
        }
        const data = await response.json();
        setInstructors(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading instructors...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Our Expert Instructors
        </h2>
        <div className="flex gap-2">
          <select className="text-sm border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
            <option>All Specialties</option>
            <option>Vinyasa Flow</option>
            <option>Power Yoga</option>
            <option>Restorative Yoga</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {instructors.map((instructor) => (
          <div
            key={instructor._id}
            className="bg-gray-50 rounded-xl p-6 flex gap-6 hover:bg-gray-100 transition-colors duration-300"
          >
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={instructor.image}
                  alt={instructor.fullName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1" fill="currentColor" />
                  {/* You might need to add a default rating */}
                  {instructor.rating || "N/A"}
                </div>
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {instructor.fullName}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {instructor.qualifications
                      .split(", ")
                      .map((cert, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                        >
                          {cert}
                        </span>
                      ))}
                  </div>
                </div>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors duration-200">
                  Book Session
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-3">{instructor.bio}</p>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 text-purple-600 mr-2" />
                  {instructor.experience} years experience
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 text-purple-600 mr-2" />
                  {instructor.classes.length} classes offered
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex gap-4">
                  <a
                    href={`mailto:${instructor.email}`}
                    className="text-sm text-gray-600 hover:text-purple-600 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    {instructor.email}
                  </a>
                  <a
                    href={`tel:${instructor.phone}`}
                    className="text-sm text-gray-600 hover:text-purple-600 flex items-center"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    {instructor.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorsList;

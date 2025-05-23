import React, { useEffect, useState } from "react";
import { Star, Award, Users, Mail, Phone } from "lucide-react";
import Button from "../../ui/button";
import { Link } from "react-router-dom";

const PopularInstructor = () => {
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

  if (loading) {
    return <div className="text-center py-8">Loading instructors...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Error loading instructors: {error}</p>
      </div>
    );
  }

  // Get only the first two instructors
  const displayedInstructors = instructors.slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-5xl font-bold mb-6 text-center">Our Instructors</h2>

      {displayedInstructors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg">No instructors available at the moment</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedInstructors.map((instructor) => (
              <div
                key={instructor._id}
                className="bg-white rounded-lg p-6 flex gap-6 hover:shadow-md transition-shadow duration-300 border border-gray-200"
              >
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={instructor.image}
                      alt={instructor.fullName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                    />
                    <br></br>
                    <Link to={`/instructor-details/${instructor._id}`}>
                      <Button text="Book Session" />
                    </Link>
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {instructor.fullName}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {instructor.qualifications &&
                          instructor.qualifications
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
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 text-purple-600 mr-2" />
                      {instructor.experience} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 text-purple-600 mr-2" />
                      {instructor.classes && instructor.classes.length} classes
                    </div>
                  </div>

                  {instructor.serviceTypes &&
                    instructor.serviceTypes.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">
                          Service Types
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {instructor.serviceTypes.map((service, index) => (
                            <span
                              key={index}
                              className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

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

          {instructors.length > 2 && (
            <div className="text-center mt-8">
              <Link
                to="/instructors"
                className="inline-block px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors duration-300"
              >
                See All Instructors ({instructors.length})
              </Link>
            </div>
          )}
        </>
      )}
      <div className="text-center mt-10">
        <Link
          to="/instructors"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          View All
          <svg
            className="ml-2 -mr-1 w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PopularInstructor;

import React, { useEffect, useState } from "react";
import {
  Star,
  Award,
  Calendar,
  Users,
  Mail,
  Phone,
  Search,
  Filter,
  X,
} from "lucide-react";
import Button from "../../ui/button";
import { Link } from "react-router-dom";

const InstructorsList = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [serviceType, setServiceType] = useState("all");

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

  // Apply filters and sorting
  const filteredInstructors = instructors
    .filter((instructor) => {
      if (!instructor) return false;

      const instructorName = (instructor.fullName || "").toLowerCase();
      const instructorBio = (instructor.bio || "").toLowerCase();
      const instructorExperience = instructor.experience || 0;
      const instructorServices = instructor.serviceTypes || [];

      const matchesSearch =
        instructorName.includes(searchQuery.toLowerCase()) ||
        instructorBio.includes(searchQuery.toLowerCase());

      const matchesExperience =
        selectedExperience === "all" ||
        (selectedExperience === "beginner" && instructorExperience < 3) ||
        (selectedExperience === "intermediate" &&
          instructorExperience >= 3 &&
          instructorExperience < 7) ||
        (selectedExperience === "advanced" && instructorExperience >= 7);

      const matchesServiceType =
        serviceType === "all" ||
        (instructor.serviceTypes &&
          instructor.serviceTypes.includes(serviceType));

      return matchesSearch && matchesExperience && matchesServiceType;
    })
    .sort((a, b) => {
      if (sortBy === "experience-high")
        return (b.experience || 0) - (a.experience || 0);
      if (sortBy === "experience-low")
        return (a.experience || 0) - (b.experience || 0);
      if (sortBy === "name")
        return (a.fullName || "").localeCompare(b.fullName || "");
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-8 mx-auto rounded-full bg-purple-200"></div>
          <p className="text-lg text-white">Loading instructors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <X className="mx-auto text-red-300 mb-4" size={32} />
          <p className="text-lg text-white mb-2">Unable to load instructors</p>
          <p className="text-purple-200 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Gather all unique service types for the filter dropdown
  const allServiceTypes = [
    ...new Set(
      instructors.flatMap((instructor) => instructor.serviceTypes || [])
    ),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-900 relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div
        className="absolute top-1/4 right-0 w-80 h-80 bg-indigo-500/20 rounded-full translate-x-1/3 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full translate-y-1/2 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-3/4 right-1/4 w-64 h-64 bg-indigo-400/20 rounded-full animate-pulse"
        style={{ animationDelay: "1.5s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-full h-full bg-purple-300/10 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Our Expert Instructors
          </h1>
          <p className="text-purple-200">
            Find the perfect instructor for your yoga journey
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300"
              size={20}
            />
            <input
              type="text"
              placeholder="Search instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-12 rounded-xl border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white placeholder-purple-300 backdrop-blur-sm transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="h-12 px-4 rounded-xl border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white backdrop-blur-sm transition-colors"
            >
              <option value="all">All Experience</option>
              <option value="beginner">Beginner (0-2 years)</option>
              <option value="intermediate">Intermediate (3-6 years)</option>
              <option value="advanced">Advanced (7+ years)</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 px-4 rounded-xl border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white   backdrop-blur-sm transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="experience-high">Experience: High to Low</option>
              <option value="experience-low">Experience: Low to High</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-4 flex items-center gap-2 border-2 border-white/10 hover:border-white/20 rounded-xl bg-white/5 text-white backdrop-blur-sm transition-colors"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 p-6 border-2 border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-purple-200 mb-2">
                  Service Type
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border-2 border-white/10 focus:border-white/20 focus:ring-0 bg-white/5 text-white"
                >
                  <option value="all">All Service Types</option>
                  {allServiceTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {filteredInstructors.length === 0 ? (
          <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border-2 border-white/10">
            <Filter className="mx-auto text-purple-300 mb-4" size={32} />
            <p className="text-lg text-white">No instructors found</p>
            <p className="text-purple-200 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInstructors.map((instructor) => (
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
                    <Link
                      to={`/instructor-details/${instructor._id}`}
                      onClick={() =>
                        console.log("Instructor Details:", instructor)
                      }
                    >
                      <Button text="Book Session" />
                    </Link>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{instructor.bio}</p>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Award className="h-4 w-4 text-purple-600 mr-2" />
                      {instructor.experience} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 text-purple-600 mr-2" />
                      {instructor.classes && instructor.classes.length} classes
                      offered
                    </div>
                  </div>

                  {/* Service Types Section */}
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
        )}
      </div>
    </div>
  );
};

export default InstructorsList;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Users, Calendar } from "lucide-react";

function InstructorDetails() {
  const { instructorId } = useParams(); // Get instructor ID from URL params
  const [instructor, setInstructor] = useState(null);

  // Fetch instructor data based on ID
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/instructors/${instructorId}`
        );
        const data = await response.json();
        setInstructor(data);
      } catch (error) {
        console.error("Error fetching instructor data:", error);
      }
    };

    fetchInstructorData();
  }, [instructorId]);

  // If the instructor data is still loading, display a loading message
  if (!instructor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      {/* Profile Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Column - Photo and Basic Info */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={instructor.image}
                alt={instructor.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
            </div>

            {/* Contact Information */}
            <div className="mt-6 text-center">
              <p className="text-white/90 text-sm mb-1">{instructor.email}</p>
              <p className="text-white/90 text-sm">{instructor.phone}</p>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {instructor.fullName}
            </h1>
            <p className="text-white/90 mb-2">
              {instructor.experience}+ years Teaching Experience
            </p>

            <button className="bg-purple-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-600 transition-colors">
              Book a Class
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-4">
            ABOUT {instructor.fullName.toUpperCase()}
          </h2>
          <p className="text-white/80 mb-8">{instructor.bio}</p>

          {/* Qualifications Section */}
          <h2 className="text-2xl font-semibold text-white mb-6">
            QUALIFICATIONS
          </h2>
          <div className="space-y-4 mb-8">
            {instructor.qualifications.split(", ").map((qual, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">{qual}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Classes Section */}
          <h2 className="text-2xl font-semibold text-white mb-6">CLASSES</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {instructor.classes.map((class_, index) => (
              <div
                key={index}
                className="bg-white/10 rounded-xl p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={class_.image}
                    alt={class_.className}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {class_.className}
                    </h3>
                    <span className="text-purple-300 text-sm">
                      {class_.difficultyLevel}
                    </span>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  {class_.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(class_.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{class_.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {class_.capacity} students max
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{class_.totalDuration}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    ${class_.price}
                  </span>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-600 transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorDetails;

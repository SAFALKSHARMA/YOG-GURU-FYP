import React from "react";
import { BookOpen, Award } from "lucide-react";

function InstructorAbout({ instructor }) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
        <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-purple-700" />
          About {instructor.fullName.split(" ")[0]}
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">{instructor.bio}</p>

        <div className="flex flex-wrap gap-2">
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            Yoga Instructor
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            Meditation
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            Pilates
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            Mind & Body
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-purple-700" />
          Qualifications & Certifications
        </h2>
        <div className="space-y-4">
          {instructor.qualifications.split(", ").map((qual, index) => (
            <div
              key={index}
              className="flex items-start bg-purple-50 p-4 rounded-xl"
            >
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">✓</span>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">{qual}</p>
                <p className="text-gray-500 text-sm mt-1">
                  Certified{" "}
                  {new Date().getFullYear() - Math.floor(Math.random() * 10)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstructorAbout;

import React from "react";
import {
  Award,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  FileText,
  X,
} from "lucide-react";

export const Modal = ({ instructor, onClose }) => {
  if (!instructor) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl max-w-4xl w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Award className="mr-3 text-purple-600" size={24} />
            Instructor Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center">
            <img
              src={instructor.image || "/api/placeholder/150/150"}
              alt={instructor.fullName}
              className="w-48 h-48 rounded-lg object-cover shadow-md"
            />

            <div className="mt-6 w-full">
              <div className="flex items-center justify-center mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                    instructor.status === "Approved"
                      ? "bg-green-500"
                      : instructor.status === "Rejected"
                      ? "bg-red-500"
                      : "bg-amber-500"
                  }`}
                >
                  {instructor.status}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {instructor.fullName}
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail
                  size={18}
                  className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{instructor.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone
                  size={18}
                  className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{instructor.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar
                  size={18}
                  className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="text-gray-800">{instructor.experience} years</p>
                </div>
              </div>

              <div className="flex items-start">
                <GraduationCap
                  size={18}
                  className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-sm text-gray-500">Qualifications</p>
                  <p className="text-gray-800">{instructor.qualifications}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FileText
                  size={18}
                  className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                />
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="text-gray-800">{instructor.bio}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Service Types</h4>
              <div className="flex flex-wrap gap-2">
                {instructor.serviceType && instructor.serviceType.length > 0 ? (
                  instructor.serviceType.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No services specified</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <FileText size={18} className="mr-2 text-purple-600" />
              Documents
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {instructor.documents && instructor.documents.length > 0 ? (
                instructor.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <img
                      src={doc || "/api/placeholder/150/150"}
                      alt={`Document ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-2">
                  No documents available
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <Award size={18} className="mr-2 text-purple-600" />
              Certificates
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {instructor.certificates && instructor.certificates.length > 0 ? (
                instructor.certificates.map((cert, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <img
                      src={cert || "/api/placeholder/150/150"}
                      alt={`Certificate ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-2">
                  No certificates available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

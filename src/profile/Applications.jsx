// Applications.js
import React from "react";
import { Calendar } from "lucide-react";

const Applications = ({ applications }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          My Applications
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Track the status of your adoption applications.
        </p>
      </div>

      <div className="px-6 py-5">
        {applications.length > 0 ? (
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-16 w-16">
                      <img
                        src={application.petImage}
                        alt={application.petName}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {application.petName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted on {application.submittedDate}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : application.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                    <div>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No applications yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start the adoption process by applying for a pet.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700">
                Browse Available Pets
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;

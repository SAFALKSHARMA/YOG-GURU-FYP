// Applications.js
import React, { useContext, useEffect, useState } from "react";
import { Calendar, X } from "lucide-react";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Applications = () => {
  const { userData, backendUrl } = useContext(AppContent);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!userData?.userId) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${backendUrl}/api/bookings?userId=${userData?.userId}`
        );
        setApplications(res.data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userData, backendUrl]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openModal = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
    // Re-enable scrolling
    document.body.style.overflow = "auto";
  };

  const handleBrowseClasses = () => {
    navigate("/classes");
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-5 bg-indigo-500">
          <div className="flex items-center">
            <div className="p-2 mr-4 bg-white bg-opacity-20 rounded-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                My Class Applications
              </h3>
              <p className="text-sm text-indigo-100 mt-1">
                Track the status of your yoga class enrollment applications
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="h-6 w-6 border-2 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          ) : Array.isArray(applications) && applications.length > 0 ? (
            <div className="overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <li key={application._id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-16 w-16">
                        {application.instructorId?.image ? (
                          <img
                            src={application.instructorId.image}
                            alt={`Instructor: ${application.instructorId.fullName}`}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                            <span>No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Session with{" "}
                          {application.instructorId?.fullName || "Instructor"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(application.preferredDate)} at{" "}
                          {application.preferredTime}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {application.sessionDuration} minutes
                        </p>
                        <p className="text-sm text-gray-500">
                          Yoga Type: {application.yogaType || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            application.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : application.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-indigo-100 text-indigo-800"
                          }`}
                        >
                          {application.status || "Pending"}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => openModal(application)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all"
                        >
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
              <Calendar className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No applications yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Start your yoga journey by applying for a class.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleBrowseClasses}
                  className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-all"
                >
                  Browse Classes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 relative">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-indigo-500 text-white rounded-t-lg">
              <h3 className="text-lg font-medium">Booking Details</h3>
              <button
                onClick={closeModal}
                className="text-white hover:bg-indigo-600 focus:outline-none p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                {selectedApplication.instructorId?.image ? (
                  <img
                    src={selectedApplication.instructorId.image}
                    alt={`Instructor: ${selectedApplication.instructorId.fullName}`}
                    className="h-20 w-20 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                    <span>No Image</span>
                  </div>
                )}
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedApplication.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Instructor:{" "}
                    {selectedApplication.instructorId?.fullName ||
                      "Not assigned"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-sm">
                  <p className="text-indigo-600 font-medium">
                    Contact Information
                  </p>
                  <p>Email: {selectedApplication.email}</p>
                  <p>Phone: {selectedApplication.phoneNumber}</p>
                </div>
                <div className="text-sm">
                  <p className="text-indigo-600 font-medium">Session Details</p>
                  <p>Date: {formatDate(selectedApplication.preferredDate)}</p>
                  <p>Time: {selectedApplication.preferredTime}</p>
                  <p>Duration: {selectedApplication.sessionDuration} minutes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-sm">
                  <p className="text-indigo-600 font-medium">Location</p>
                  <p>
                    Type:{" "}
                    {selectedApplication.sessionLocation === "instructor"
                      ? "At Instructor's Location"
                      : "At Your Location"}
                  </p>
                  {selectedApplication.sessionLocation !== "instructor" && (
                    <>
                      <p>Address: {selectedApplication.streetAddress}</p>
                      <p>City: {selectedApplication.city}</p>
                      <p>Zip Code: {selectedApplication.zipCode}</p>
                    </>
                  )}
                </div>
                <div className="text-sm">
                  <p className="text-indigo-600 font-medium">
                    Additional Information
                  </p>
                  <p>
                    Yoga Type: {selectedApplication.yogaType || "Not specified"}
                  </p>
                  <p>Status: {selectedApplication.status || "Pending"}</p>
                  <p>
                    Submitted on: {formatDate(selectedApplication.createdAt)}
                  </p>
                </div>
              </div>

              {selectedApplication.remarks && (
                <div className="mt-4">
                  <p className="text-indigo-600 font-medium text-sm">Remarks</p>
                  <p className="text-sm bg-gray-50 p-3 rounded mt-1 border border-gray-100">
                    {selectedApplication.remarks}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end rounded-b-lg border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Applications;

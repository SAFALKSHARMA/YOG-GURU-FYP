// Applications.js
import React, { useContext, useEffect, useState } from "react";
import {
  Calendar,
  X,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
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
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
    document.body.style.overflow = "auto";
  };

  const handleBrowseClasses = () => {
    navigate("/classes");
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Class Applications
              </h1>
              <p className="text-gray-500 mt-1">
                Track your yoga class enrollment status
              </p>
            </div>
          </div>
          <button
            onClick={handleBrowseClasses}
            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          >
            Browse More Classes
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-32 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="h-6 w-6 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">
              Loading your applications...
            </span>
          </div>
        ) : Array.isArray(applications) && applications.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {applications.map((application) => (
                <li
                  key={application._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      {application.instructorId?.image ? (
                        <img
                          src={application.instructorId.image}
                          alt={`Instructor: ${application.instructorId.fullName}`}
                          className="h-14 w-14 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          <User className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">
                        Session with{" "}
                        {application.instructorId?.fullName || "Instructor"}
                      </h3>

                      <div className="mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                          <span>{formatDate(application.preferredDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                          <span>
                            {application.preferredTime} (
                            {application.sessionDuration} min)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                          <span>
                            {application.sessionLocation === "instructor"
                              ? "At Instructor's Location"
                              : "At Your Location"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex items-center space-x-4">
                      <span
                        className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadgeStyle(
                          application.status
                        )}`}
                      >
                        {application.status || "Pending"}
                      </span>
                      <button
                        onClick={() => openModal(application)}
                        className="whitespace-nowrap px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all"
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <Calendar className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              No applications yet
            </h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Begin your yoga journey by exploring available classes and
              applying for a session that fits your schedule.
            </p>
            <div className="mt-6">
              <button
                onClick={handleBrowseClasses}
                className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
              >
                Browse Classes
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Enhanced Detail Modal */}
      {isModalOpen && selectedApplication && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              {/* Instructor Info Section */}
              <div className="flex items-center mb-6">
                {selectedApplication.instructorId?.image ? (
                  <img
                    src={selectedApplication.instructorId.image}
                    alt={`Instructor: ${selectedApplication.instructorId.fullName}`}
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
                    <User className="h-8 w-8" />
                  </div>
                )}
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedApplication.fullName}
                  </p>
                  <div className="flex items-center text-gray-500 mt-1">
                    <p className="text-sm">
                      <span
                        className={`inline-flex items-center mr-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(
                          selectedApplication.status
                        )}`}
                      >
                        {selectedApplication.status || "Pending"}
                      </span>
                      Instructor:{" "}
                      {selectedApplication.instructorId?.fullName ||
                        "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Column */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Contact Information
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedApplication.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{selectedApplication.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Session Column */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    Session Details
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">Date:</span>
                      <span>
                        {formatDate(selectedApplication.preferredDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">Time:</span>
                      <span>{selectedApplication.preferredTime}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">Duration:</span>
                      <span>{selectedApplication.sessionDuration} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">Yoga Type:</span>
                      <span>
                        {selectedApplication.yogaType || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Location Column */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    Location
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Location Type:</span>
                      <span className="block mt-1">
                        {selectedApplication.sessionLocation === "instructor"
                          ? "At Instructor's Location"
                          : "At Your Location"}
                      </span>
                    </div>
                    {selectedApplication.sessionLocation !== "instructor" && (
                      <>
                        <div className="pt-2">
                          <span className="text-gray-500">Address:</span>
                          <div className="mt-1">
                            <p>{selectedApplication.streetAddress}</p>
                            <p>
                              {selectedApplication.city},{" "}
                              {selectedApplication.zipCode}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Info Column */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    Additional Information
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="block mt-1">
                        {formatDate(selectedApplication.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks Section */}
              {selectedApplication.remarks && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                    Remarks
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 text-sm">
                    {selectedApplication.remarks}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex justify-end border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors focus:outline-none"
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

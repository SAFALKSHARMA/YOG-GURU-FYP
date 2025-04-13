import React, { useEffect, useState, useRef } from "react";
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  Award,
  UserX,
  Filter,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  FileText,
  X,
} from "lucide-react";
import Sidebar from "./Sidebar";

// Modal Component with improved design
const Modal = ({ instructor, onClose }) => {
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

const ManageInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/instructors/applications"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch instructor applications");
        }
        const data = await response.json();
        setInstructors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleApprove = async (instructorId) => {
    setIsProcessing(true);
    try {
      if (!instructorId) {
        throw new Error("Instructor ID is required");
      }

      const response = await fetch(
        `http://localhost:3000/api/instructors/approve/${instructorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to approve instructor");
      }

      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor._id === instructorId
            ? { ...instructor, status: "Approved" }
            : instructor
        )
      );

      setShowDropdown(null);
      // Add a notification here if needed
    } catch (err) {
      setError(err.message || "Failed to approve instructor");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (instructorId) => {
    setIsProcessing(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/instructors/reject/${instructorId}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to reject instructor");
      }
      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor._id === instructorId
            ? { ...instructor, status: "Rejected" }
            : instructor
        )
      );

      setShowDropdown(null);
      // Add a notification here if needed
    } catch (err) {
      setError(err.message || "Failed to reject instructor");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleDropdown = (instructorId, e) => {
    e.stopPropagation();
    setShowDropdown((prevId) =>
      prevId === instructorId ? null : instructorId
    );
  };

  const handleViewDetails = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDropdown(null);
  };

  const handleCloseModal = () => {
    setSelectedInstructor(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Filter instructors based on search term and status
  const filteredInstructors = instructors.filter((instructor) => {
    const matchesSearch =
      instructor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || instructor.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/instructors/applications"
      );
      if (!response.ok) {
        throw new Error("Failed to refresh instructor applications");
      }
      const data = await response.json();
      setInstructors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/5">
        <Sidebar />
      </div>
      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <GraduationCap className="mr-3 text-purple-600" size={28} />
              Instructor Applications
            </h1>

            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="relative flex-grow md:flex-grow-0 md:w-40">
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw
                  size={18}
                  className={`mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-12">
              <RefreshCw size={24} className="animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading instructors...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
              <UserX className="mr-3" size={20} />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredInstructors.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <UserX size={40} className="mx-auto mb-3 text-gray-400" />
              <p>No instructor applications found matching your criteria.</p>
            </div>
          )}

          {!loading && !error && filteredInstructors.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-sm font-medium text-gray-500 rounded-tl-lg">
                      Instructor
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">
                      Contact
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">
                      Experience
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500 rounded-tr-lg text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInstructors.map((instructor) => (
                    <tr
                      key={instructor._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <img
                            src={instructor.image || "/api/placeholder/40/40"}
                            alt={instructor.fullName}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {instructor.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {instructor.qualifications}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-800">
                            <Mail size={14} className="mr-1 text-gray-400" />
                            {instructor.email}
                          </div>
                          <div className="flex items-center text-gray-800 mt-1">
                            <Phone size={14} className="mr-1 text-gray-400" />
                            {instructor.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          <span className="font-medium">
                            {instructor.experience}
                          </span>
                          <span className="text-gray-500 ml-1">years</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                            instructor.status === "Approved"
                              ? "bg-green-500"
                              : instructor.status === "Rejected"
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                        >
                          {instructor.status}
                        </span>
                      </td>
                      <td className="p-4 text-right relative">
                        <button
                          onClick={(e) =>
                            handleToggleDropdown(instructor._id, e)
                          }
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                          disabled={isProcessing}
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {showDropdown === instructor._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 bg-white border border-gray-100 shadow-lg rounded-lg w-44 z-10 py-1"
                            style={{ top: "100%" }}
                          >
                            <button
                              onClick={() => handleViewDetails(instructor)}
                              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                              <Eye size={16} className="mr-2 text-blue-500" />
                              View Details
                            </button>
                            {instructor.status !== "Approved" && (
                              <button
                                onClick={() => handleApprove(instructor._id)}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <CheckCircle
                                  size={16}
                                  className="mr-2 text-green-500"
                                />
                                Approve
                              </button>
                            )}
                            {instructor.status !== "Rejected" && (
                              <button
                                onClick={() => handleReject(instructor._id)}
                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <XCircle
                                  size={16}
                                  className="mr-2 text-red-500"
                                />
                                Reject
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {selectedInstructor && (
        <Modal instructor={selectedInstructor} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ManageInstructors;

import React, { useEffect, useState, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  Clock,
  Users,
  Search,
  RefreshCw,
  Filter,
  Briefcase,
  UserCheck,
  X,
  BookOpen,
  MoreVertical,
} from "lucide-react";
import Sidebar from "./Sidebar";
import ClassDetailsModal from "./classModal";

const ManageClass = () => {
  const [classes, setClasses] = useState([]); // Changed from users to classes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isUpdating, setIsUpdating] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  // Fetch classes data from API
  useEffect(() => {
    fetchClasses();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside = Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      );

      if (clickedOutside) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/classes/applications"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch classes data");
      }
      const data = await response.json();
      setClasses(data.classes || []); // Update to use the correct data structure
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClassDetails = (classItem) => {
    setSelectedClass(classItem);
    setOpenDropdownId(null);
  };

  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  const handleStatusChange = async (classId, newStatus) => {
    setIsUpdating(true);
    setOpenDropdownId(null);

    try {
      const response = await fetch(
        "http://localhost:3000/api/classes/update-status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ classId, newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the specific class status in the state
      setClasses((prevClasses) =>
        prevClasses.map((classItem) =>
          classItem._id === classId
            ? { ...classItem, status: newStatus }
            : classItem
        )
      );
    } catch (err) {
      console.error("Error updating class status:", err);
      setError("Error updating class status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleDropdown = (classId, e) => {
    e.stopPropagation();
    setOpenDropdownId((prevId) => (prevId === classId ? null : classId));
  };

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.instructor?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      classItem.instructor?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || classItem.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/5">
        <Sidebar />
      </div>

      <div className="flex-1 p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <BookOpen className="mr-3 text-purple-600" size={28} />
              Class Applications
            </h1>

            <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-3 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search classes or instructors..."
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
                onClick={fetchClasses}
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
              <span className="ml-3 text-gray-600">Loading classes...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
              <XCircle className="mr-3" size={20} />
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredClasses.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
              <BookOpen size={40} className="mx-auto mb-3 text-gray-400" />
              <p>No classes found matching your criteria.</p>
            </div>
          )}

          {!loading && !error && filteredClasses.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-sm font-medium text-gray-500 rounded-tl-lg">
                      Instructor
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">
                      Class
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">
                      Schedule
                    </th>
                    <th className="p-4 text-sm font-medium text-gray-500">
                      Capacity
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
                  {filteredClasses.map((classItem) => (
                    <tr
                      key={classItem._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          <img
                            src={
                              classItem.instructor?.image ||
                              "/api/placeholder/40/40"
                            }
                            alt={classItem.instructor?.fullName}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <span className="font-medium text-gray-800">
                            {classItem.instructor?.fullName || "No instructor"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Briefcase
                            size={16}
                            className="text-purple-500 mr-2"
                          />
                          <span className="font-medium">
                            {classItem.className}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-gray-700">
                            <Calendar
                              size={14}
                              className="mr-2 text-gray-400"
                            />
                            {new Date(classItem.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Clock size={14} className="mr-2 text-gray-400" />
                            {classItem.time}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <Users size={16} className="mr-2 text-gray-400" />
                          <span>{classItem.capacity}</span>
                          <span className="text-gray-500 ml-1">seats</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                            classItem.status === "Approved"
                              ? "bg-green-500"
                              : classItem.status === "Rejected"
                              ? "bg-red-500"
                              : "bg-amber-500"
                          }`}
                        >
                          {classItem.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="relative">
                          <button
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                            onClick={(e) =>
                              handleToggleDropdown(classItem._id, e)
                            }
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openDropdownId === classItem._id && (
                            <div
                              ref={(el) =>
                                (dropdownRefs.current[classItem._id] = el)
                              }
                              className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-100 w-48"
                            >
                              <button
                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() =>
                                  handleViewClassDetails(classItem)
                                }
                              >
                                <Eye size={16} className="mr-2 text-blue-500" />
                                View Details
                              </button>

                              <button
                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() =>
                                  handleStatusChange(classItem._id, "Approved")
                                }
                                disabled={
                                  isUpdating || classItem.status === "Approved"
                                }
                              >
                                <CheckCircle
                                  size={16}
                                  className="mr-2 text-green-500"
                                />
                                Approve Class
                              </button>

                              <button
                                className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() =>
                                  handleStatusChange(classItem._id, "Rejected")
                                }
                                disabled={
                                  isUpdating || classItem.status === "Rejected"
                                }
                              >
                                <XCircle
                                  size={16}
                                  className="mr-2 text-red-500"
                                />
                                Reject Class
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedClass && (
        <ClassDetailsModal
          selectedClass={selectedClass}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ManageClass;

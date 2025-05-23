import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Eye,
  Filter,
  Calendar,
  Clock,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
} from "lucide-react";
import Table from "../../ui/Table";
import { AppContent } from "../../context/AppContext";
import Sidebar from "./Sidebar";

const BookingManagement = () => {
  const { instructorData } = useContext(AppContent);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewBooking, setViewBooking] = useState(null);
  const [filters, setFilters] = useState({
    status: "All",
    yogaType: "All",
    sessionDuration: "All",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const itemsPerPage = 10;
  const filteredBookings = bookings.filter(
    (booking) =>
      (filters.status === "All" || booking.status === filters.status) &&
      (filters.yogaType === "All" || booking.yogaType === filters.yogaType) &&
      (filters.sessionDuration === "All" ||
        booking.sessionDuration.toString() === filters.sessionDuration)
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (instructorData?._id) fetchBookings();
  }, [instructorData, currentPage, filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(
        `http://localhost:3000/api/bookings/instructor/${instructorData?._id}`
      );
      setBookings(res.data.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        bookingId: id,
        status,
        instructorId: instructorData?._id,
      };

      const response = await axios.patch(
        `http://localhost:3000/api/bookings/update-status`,
        payload
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update was not successful");
      }

      const updatedBookings = bookings.map((booking) =>
        booking._id === id ? { ...booking, status } : booking
      );

      setBookings(updatedBookings);

      if (viewBooking?._id === id) {
        setViewBooking((prev) => ({ ...prev, status }));
      }

      return updatedBookings.find((b) => b._id === id);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${status.toLowerCase()} booking`;

      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: "fullName",
      title: "Customer",
      render: (booking) => (
        <div className="flex items-center">
          {booking.userId?.image && (
            <img
              src={booking.userId.image}
              alt="User"
              className="w-8 h-8 rounded-full mr-3"
            />
          )}
          <div>
            <p className="font-medium">{booking.fullName}</p>
            <p className="text-xs text-gray-500">{booking.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "preferredDate",
      title: "Date & Time",
      render: (booking) => (
        <div>
          <div className="flex items-center text-sm">
            <Calendar size={14} className="mr-1 text-gray-500" />
            {new Date(booking.preferredDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <Clock size={12} className="mr-1" />
            {booking.preferredTime}
          </div>
        </div>
      ),
    },
    { key: "yogaType", title: "Yoga Type" },
    {
      key: "sessionDuration",
      title: "Duration",
      render: (b) => `${b.sessionDuration} min`,
    },
    {
      key: "sessionLocation",
      title: "Location",
      render: (b) =>
        b.sessionLocation === "instructor"
          ? "Instructor's Place"
          : "Customer's Place",
    },
    {
      key: "status",
      title: "Status",
      render: (booking) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            booking.status === "Approved"
              ? "bg-green-100 text-green-800"
              : booking.status === "Rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {booking.status}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (booking) => (
        <button
          onClick={() => setViewBooking(booking)}
          className="p-1 text-blue-600 hover:text-blue-800"
          title="View Details"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  const filterOptions = [
    {
      name: "status",
      options: ["All", "Pending", "Approved", "Rejected"],
    },
    {
      name: "yogaType",
      options: [
        "All",
        "Hatha",
        "Vinyasa",
        "Ashtanga",
        "Iyengar",
        "Kundalini",
        "Anything",
      ],
    },
    {
      name: "sessionDuration",
      options: ["All", "30", "60", "90"],
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeItem="bookings"
      />

      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarCollapsed ? "ml-18" : "ml-18"
        }`}
      >
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Yoga Session Bookings
          </h1>

          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>
            <div className="text-sm text-gray-500">
              Showing {paginatedBookings.length} of {filteredBookings.length}{" "}
              bookings
            </div>
          </div>

          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              {filterOptions.map((filter) => (
                <div key={filter.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.name
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={filters[filter.name]}
                    onChange={(e) =>
                      setFilters({ ...filters, [filter.name]: e.target.value })
                    }
                  >
                    {filter.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <Table
            columns={columns}
            data={paginatedBookings}
            loading={loading}
            error={error}
            emptyState={{
              title: "No bookings found",
              message: "When you get bookings, they'll appear here",
              icon: <Calendar size={32} className="mx-auto text-gray-400" />,
            }}
            rowKey="_id"
          />

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md bg-white disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md bg-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {viewBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-30 flex items-center justify-center">
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Booking Details
              </h3>
              <button
                onClick={() => setViewBooking(null)}
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center mb-6">
                {viewBooking.userId?.image ? (
                  <img
                    src={viewBooking.userId.image}
                    alt={`Customer: ${viewBooking.fullName}`}
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-4">
                    <User className="h-8 w-8" />
                  </div>
                )}
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {viewBooking.fullName}
                  </p>
                  <div className="flex items-center text-gray-500 mt-1">
                    <p className="text-sm">
                      <span
                        className={`inline-flex items-center mr-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          viewBooking.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : viewBooking.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {viewBooking.status || "Pending"}
                      </span>
                      Customer
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Contact Information
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{viewBooking.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{viewBooking.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    Session Details
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">Date:</span>
                      <span>
                        {new Date(
                          viewBooking.preferredDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">Time:</span>
                      <span>{viewBooking.preferredTime}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">Duration:</span>
                      <span>{viewBooking.sessionDuration} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-16">Yoga Type:</span>
                      <span>{viewBooking.yogaType || "Not specified"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    Location
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Location Type:</span>
                      <span className="block mt-1">
                        {viewBooking.sessionLocation === "instructor"
                          ? "At Instructor's Location"
                          : "At Customer's Location"}
                      </span>
                    </div>
                    {viewBooking.sessionLocation !== "instructor" && (
                      <>
                        <div className="pt-2">
                          <span className="text-gray-500">Address:</span>
                          <div className="mt-1">
                            <p>{viewBooking.streetAddress}</p>
                            <p>
                              {viewBooking.city}, {viewBooking.zipCode}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    Additional Information
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="block mt-1">
                        {new Date(viewBooking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {viewBooking.remarks && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                    Remarks
                  </h4>
                  <div className="bg-gray-50 rounded border border-gray-200 p-3 text-sm">
                    {viewBooking.remarks}
                  </div>
                </div>
              )}

              {viewBooking.status === "Pending" && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() =>
                      updateBookingStatus(viewBooking._id, "Rejected")
                    }
                    className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      updateBookingStatus(viewBooking._id, "Approved")
                    }
                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Eye, Filter, Calendar, Clock, X } from "lucide-react";
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
      setError(null); // Clear any previous errors

      // Request payload
      const payload = {
        bookingId: id,
        status,
        instructorId: instructorData?._id,
      };

      console.log(payload);

      const response = await axios.patch(
        `http://localhost:3000/api/bookings/update-status`,
        payload
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update was not successful");
      }

      // Optimistic UI update
      const updatedBookings = bookings.map((booking) =>
        booking._id === id ? { ...booking, status } : booking
      );

      setBookings(updatedBookings);

      if (viewBooking?._id === id) {
        setViewBooking((prev) => ({ ...prev, status }));
      }

      // Optional: Return the updated booking for further processing
      return updatedBookings.find((b) => b._id === id);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${status.toLowerCase()} booking`;

      setError(errorMessage);

      // Re-throw the error for the calling code to handle if needed
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
                  key={i}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button
                onClick={() => setViewBooking(null)}
                className="text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {viewBooking.userId?.image && (
                  <img
                    src={viewBooking.userId.image}
                    alt="User"
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {viewBooking.fullName}
                  </h3>
                  <p className="text-gray-600">{viewBooking.email}</p>
                  <p className="text-gray-600">{viewBooking.phoneNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    SESSION DETAILS
                  </h4>
                  <p>
                    <span className="text-gray-600">Date:</span>{" "}
                    {new Date(viewBooking.preferredDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="text-gray-600">Time:</span>{" "}
                    {viewBooking.preferredTime}
                  </p>
                  <p>
                    <span className="text-gray-600">Duration:</span>{" "}
                    {viewBooking.sessionDuration} minutes
                  </p>
                  <p>
                    <span className="text-gray-600">Yoga Type:</span>{" "}
                    {viewBooking.yogaType}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    LOCATION
                  </h4>
                  <p>
                    <span className="text-gray-600">Type:</span>{" "}
                    {viewBooking.sessionLocation === "instructor"
                      ? "Instructor's Place"
                      : "Customer's Place"}
                  </p>
                  {viewBooking.sessionLocation === "customer" && (
                    <>
                      <p>
                        <span className="text-gray-600">Address:</span>{" "}
                        {viewBooking.streetAddress}
                      </p>
                      <p>
                        <span className="text-gray-600">City:</span>{" "}
                        {viewBooking.city}
                      </p>
                      <p>
                        <span className="text-gray-600">Zip Code:</span>{" "}
                        {viewBooking.zipCode}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  STATUS
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    viewBooking.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : viewBooking.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {viewBooking.status}
                </span>
              </div>

              {viewBooking.remarks && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    REMARKS
                  </h4>
                  <p className="bg-gray-50 p-3 rounded">
                    {viewBooking.remarks}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                {viewBooking.status === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        updateBookingStatus(viewBooking._id, "Rejected")
                      }
                      className="px-4 py-2 border border-red-500 text-red-500 rounded-md"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        updateBookingStatus(viewBooking._id, "Approved")
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-md"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;

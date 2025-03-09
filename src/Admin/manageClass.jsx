import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import Sidebar from "./Sidebar";

const ManageClass = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null); // Track selected class for modal

  // Fetching users data from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/instructors/all-instructors"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch instructors data");
        }
        const data = await response.json();
        setUsers(data || []); // Ensure it handles undefined gracefully
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle opening the class modal
  const handleViewClassDetails = (classItem) => {
    setSelectedClass(classItem); // Set the selected class to show in the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedClass(null); // Close the modal by clearing selected class
  };

  // Function to handle updating the status of the class
  const handleStatusChange = (classId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => ({
        ...user,
        classes: user.classes.map((classItem) =>
          classItem._id === classId
            ? { ...classItem, status: newStatus }
            : classItem
        ),
      }))
    );
  };

  return (
    <div className="flex h-screen bg-purple-50">
      <div className="w-1/5">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg m-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">
          Manage Class Applications
        </h1>

        {loading && (
          <p className="text-center text-gray-500">Loading instructors...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="text-center text-gray-500">No instructors found.</p>
        )}

        {!loading && !error && users.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-100">
                <th className="p-3">Image</th>
                <th className="p-3">Instructor Name</th>
                <th className="p-3">Class Name</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) =>
                user.classes.map((classItem) => (
                  <tr
                    key={classItem._id}
                    className="border-b hover:bg-purple-50"
                  >
                    <td className="p-3">
                      <img
                        src={user.image || "https://via.placeholder.com/50"}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full border"
                      />
                    </td>
                    <td className="p-3">{user.fullName}</td>
                    <td className="p-3">{classItem.className}</td>
                    <td className="p-3">
                      {new Date(classItem.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{classItem.time}</td>
                    <td className="p-3">{classItem.capacity} seats</td>
                    <td className="p-3">
                      <span
                        className={`p-2 rounded-full ${
                          classItem.status === "Approved"
                            ? "bg-green-500 text-white"
                            : classItem.status === "Rejected"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {classItem.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-3 flex items-center space-x-2">
                      <button
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center"
                        onClick={() => handleViewClassDetails(classItem)} // Open modal with selected class data
                        title="View Details"
                      >
                        View
                      </button>
                      <button
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center"
                        onClick={() =>
                          handleStatusChange(classItem._id, "Approved")
                        } // Approve the class
                        title="Approve"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center"
                        onClick={() =>
                          handleStatusChange(classItem._id, "Rejected")
                        } // Deny the class
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Modal for viewing class details */}
        {selectedClass && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow-lg">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">
                Class Details
              </h2>
              <div>
                <p>
                  <strong>Class Name:</strong> {selectedClass.className}
                </p>
                <p>
                  <strong>Description:</strong> {selectedClass.description}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedClass.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {selectedClass.time}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedClass.duration} minutes
                </p>
                <p>
                  <strong>Capacity:</strong> {selectedClass.capacity} seats
                </p>
                <p>
                  <strong>Total Duration:</strong> {selectedClass.totalDuration}
                </p>
                <p>
                  <strong>Price:</strong> Rs. {selectedClass.price}
                </p>
                <p>
                  <strong>Class Link:</strong> {selectedClass.classLink}
                </p>
                <img
                  src={selectedClass.image}
                  alt={selectedClass.className}
                  className="w-32 h-32 object-cover"
                />
              </div>
              <button
                className="mt-4 p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClass;

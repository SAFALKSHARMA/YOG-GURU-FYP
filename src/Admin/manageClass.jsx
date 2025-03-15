import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import Sidebar from "./Sidebar";
import ClassDetailsModal from "./classModal";

const ManageClass = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  // Fetch classes data from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/instructors/all-instructors"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch classes data");
        }
        const data = await response.json();
        setUsers(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Function to handle opening the class modal
  const handleViewClassDetails = (classItem) => {
    setSelectedClass(classItem);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedClass(null);
  };

  // Function to handle updating the status of the class
  const handleStatusChange = async (classId, newStatus) => {
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

      // Update the local state after successful status update
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
    } catch (err) {
      console.error("Error updating class status:", err);
      setError("Error updating class status");
    }
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
          <p className="text-center text-gray-500">Loading classes...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <p className="text-center text-gray-500">No classes found.</p>
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
                user.classes?.map((classItem) => (
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
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        onClick={() => handleViewClassDetails(classItem)}
                      >
                        View
                      </button>
                      <button
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                        onClick={() =>
                          handleStatusChange(classItem._id, "Approved")
                        }
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        onClick={() =>
                          handleStatusChange(classItem._id, "Rejected")
                        }
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

        <ClassDetailsModal
          selectedClass={selectedClass}
          handleCloseModal={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default ManageClass;

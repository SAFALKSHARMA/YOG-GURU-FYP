import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import Sidebar from "./Sidebar";

const ManageInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      // Ensure instructorId is valid
      if (!instructorId) {
        throw new Error("Instructor ID is required");
      }

      // Send the PUT request to approve the instructor
      const response = await fetch(
        `http://localhost:3000/api/instructors/approve/${instructorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json", // Add header for consistency
          },
        }
      );

      // Check if the response is ok
      if (!response.ok) {
        const errData = await response.json();
        console.error("Error data:", errData); // Log the error data for debugging
        throw new Error(errData.message || "Failed to approve instructor");
      }

      // Update instructors state after successful approval
      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor._id === instructorId
            ? { ...instructor, status: "Approved" }
            : instructor
        )
      );

      // Optionally, handle any additional success behavior here
      alert("Instructor approved successfully!");
    } catch (err) {
      // Log the error message for debugging
      console.error("Approval error:", err);
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
    } catch (err) {
      setError(err.message || "Failed to reject instructor");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-purple-50">
      <div className="w-1/5">
        <Sidebar />
      </div>

      <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg m-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">
          Manage Instructors
        </h1>

        {loading && (
          <p className="text-center text-gray-500">Loading instructors...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && instructors.length === 0 && (
          <p className="text-center text-gray-500">
            No instructor applications found.
          </p>
        )}

        {!loading && !error && instructors.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-100">
                <th className="p-3">Image</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Qualifications</th>
                <th className="p-3">Bio</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((instructor) => (
                <tr
                  key={instructor._id}
                  className="border-b hover:bg-purple-50"
                >
                  <td className="p-3">
                    <img
                      src={instructor.image || "https://via.placeholder.com/50"}
                      alt={instructor.fullName}
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>
                  <td className="p-3">{instructor.fullName}</td>
                  <td className="p-3">{instructor.email}</td>
                  <td className="p-3">{instructor.phone}</td>
                  <td className="p-3">{instructor.experience} years</td>
                  <td className="p-3">{instructor.qualifications}</td>
                  <td className="p-3">{instructor.bio}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        instructor.status === "Approved"
                          ? "bg-green-500"
                          : instructor.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {instructor.status}
                    </span>
                  </td>
                  <td className="p-3 flex items-center space-x-2">
                    <button
                      onClick={() => handleApprove(instructor._id)}
                      className={`p-2 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center ${
                        isProcessing ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isProcessing}
                    >
                      <CheckCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleReject(instructor._id)}
                      className={`p-2 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center ${
                        isProcessing ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={isProcessing}
                    >
                      <XCircle size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageInstructors;

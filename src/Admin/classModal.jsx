// ClassDetailsModal.js
import React from "react";

const ClassDetailsModal = ({ selectedClass, handleCloseModal }) => {
  if (!selectedClass) return null;

  return (
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
  );
};

export default ClassDetailsModal;

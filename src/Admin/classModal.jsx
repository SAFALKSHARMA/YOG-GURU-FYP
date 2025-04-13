import React, { useContext, useState, useRef } from "react";
import {
  X,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Video,
  Clock3,
  BookOpen,
  Info,
  RefreshCw,
  Save,
  Upload,
  Trash2,
} from "lucide-react";
import { AppContent } from "../context/AppContext";

const ClassDetailsModal = ({
  selectedClass,
  handleCloseModal,
  onSaveChanges,
  onDeleteClass,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedClass, setEditedClass] = useState({ ...selectedClass });
  const { userData } = useContext(AppContent);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null); // Track the raw file

  if (!selectedClass) return null;

  const handleInputChange = (field, value) => {
    setEditedClass((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the file object
      // Create a temporary preview (optional)
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedClass((prev) => ({ ...prev, image: event.target.result })); // Local preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      // Prepare FormData for file upload
      const formData = new FormData();

      // Append all class data
      Object.keys(editedClass).forEach((key) => {
        if (key !== "image") {
          formData.append(key, editedClass[key]);
        }
      });

      // Append the file if it exists
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      // Call parent save handler with FormData
      if (onSaveChanges) {
        await onSaveChanges(formData); // Send FormData instead of JSON
      }
    }
    setIsEditing(!isEditing);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD for input type="date"
  };

  const handleDelete = () => {
    onDeleteClass(selectedClass); // Pass the entire class object (or selectedClass._id)
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl max-w-2xl w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <BookOpen className="mr-3 text-purple-600" size={24} />
            {isEditing ? "Edit Class" : "Class Details"}
          </h2>
          <button
            onClick={handleCloseModal}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden shadow-sm bg-gray-50 relative">
              <img
                src={editedClass.image || "/api/placeholder/300/300"}
                alt={editedClass.className}
                className="w-full aspect-square object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={triggerFileInput}
                    className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <Upload size={24} className="text-purple-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <span
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                  editedClass.status === "Approved"
                    ? "bg-green-500"
                    : editedClass.status === "Rejected"
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
              >
                {editedClass.status || "Pending"}
              </span>
            </div>
          </div>

          <div className="md:col-span-2">
            {isEditing ? (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class Name
                </label>
                <input
                  type="text"
                  value={editedClass.className || ""}
                  onChange={(e) =>
                    handleInputChange("className", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Class Name"
                />
              </div>
            ) : (
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {editedClass.className}
              </h3>
            )}

            <div className="space-y-4">
              <div className="flex items-start">
                <Info
                  size={18}
                  className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                />
                <div className="w-full">
                  <p className="text-sm text-gray-500">Description</p>
                  {isEditing ? (
                    <textarea
                      value={editedClass.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-24"
                      placeholder="Class Description"
                    />
                  ) : (
                    <p className="text-gray-800">{editedClass.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar
                    size={18}
                    className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                  />
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Date</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={formatDate(editedClass.date)}
                        onChange={(e) =>
                          handleInputChange("date", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {new Date(editedClass.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock
                    size={18}
                    className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                  />
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Time</p>
                    {isEditing ? (
                      <input
                        type="time"
                        value={editedClass.time || ""}
                        onChange={(e) =>
                          handleInputChange("time", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    ) : (
                      <p className="text-gray-800">{editedClass.time}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Clock3
                    size={18}
                    className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                  />
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Duration</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedClass.duration || ""}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Duration in minutes"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {editedClass.duration} minutes
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <Users
                    size={18}
                    className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                  />
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Capacity</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedClass.capacity || ""}
                        onChange={(e) =>
                          handleInputChange("capacity", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Capacity"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {editedClass.capacity} seats
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Clock3
                    size={18}
                    className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                  />
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Total Duration</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedClass.totalDuration || ""}
                        onChange={(e) =>
                          handleInputChange("totalDuration", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Total Duration"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {editedClass.totalDuration}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <DollarSign
                    size={18}
                    className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                  />
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Price</p>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedClass.price || ""}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        placeholder="Price"
                      />
                    ) : (
                      <p className="text-gray-800">Rs. {editedClass.price}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <Video
                  size={18}
                  className="mr-3 text-purple-600 mt-1 flex-shrink-0"
                />
                <div className="w-full">
                  <p className="text-sm text-gray-500">Class Link</p>
                  {isEditing ? (
                    <input
                      type="url"
                      value={editedClass.classLink || ""}
                      onChange={(e) =>
                        handleInputChange("classLink", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Class Link"
                    />
                  ) : (
                    <a
                      href={editedClass.classLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {editedClass.classLink}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {userData?.role === "instructor" && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium flex items-center"
                  onClick={handleDelete}
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>

                <button
                  className={`px-6 py-2 ${
                    isEditing
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-blue-600 hover:bg-blue-500"
                  } text-white rounded-lg transition-colors font-medium flex items-center`}
                  onClick={toggleEditMode}
                >
                  {isEditing ? (
                    <>
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} className="mr-2" />
                      Edit
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailsModal;

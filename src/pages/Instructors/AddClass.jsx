import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../ui/InputField";
import { AppContent } from "../../context/AppContext";
import ToastComponent from "../../ui/ToastComponent";
import Sidebar from "./Sidebar";

const AddClass = () => {
  const { instructorData } = useContext(AppContent);
  const [formData, setFormData] = useState({
    className: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    capacity: "",
    totalDuration: "",
    price: "",
    classLink: "",
    difficultyLevel: "Beginner",
    image: null,
  });

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Image upload failed! Try again.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!instructorData || !instructorData._id) {
      toast.error("Instructor ID is missing. Please reload the page.");
      return;
    }

    let imageUrl = "";
    if (formData.image) {
      toast.info("Uploading image...");
      imageUrl = await uploadImageToCloudinary(formData.image);
      if (!imageUrl) return;
    }

    const [hours, minutes] = formData.time.split(":");
    const formattedHours = hours % 12 || 12;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${formattedHours}:${minutes} ${period}`;

    const submissionData = {
      ...formData,
      time: formattedTime,
      image: imageUrl,
      instructorId: instructorData._id,
    };

    try {
      const response = await fetch("http://localhost:3000/api/classes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Class added successfully!");
        setFormData({
          className: "",
          description: "",
          date: "",
          time: "",
          duration: "",
          capacity: "",
          totalDuration: "",
          price: "",
          classLink: "",
          difficultyLevel: "Beginner",
          image: null,
        });
      } else {
        toast.error(result.message || "Failed to add class. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong! Try again later.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar - will handle its own responsive behavior */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 lg:ml-8">
        {" "}
        {/* ml-16 accounts for collapsed sidebar */}
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
            Add New Class
          </h1>

          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <InputField
                label="Class Name"
                type="text"
                name="className"
                placeholder="Enter class name"
                value={formData.className}
                onChange={handleChange}
                required
              />

              <InputField
                label="Description"
                type="textarea"
                name="description"
                placeholder="Enter class description"
                value={formData.description}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputField
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    step="60"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InputField
                  label="Duration (minutes)"
                  type="number"
                  name="duration"
                  placeholder="60"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Capacity"
                  type="number"
                  name="capacity"
                  placeholder="20"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <InputField
                label="Total Duration"
                type="text"
                name="totalDuration"
                placeholder="e.g., 1 month, 2 months"
                value={formData.totalDuration}
                onChange={handleChange}
                required
              />

              <InputField
                label="Price"
                type="number"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <InputField
                label="Class Link"
                type="url"
                name="classLink"
                placeholder="Enter class link"
                value={formData.classLink}
                onChange={handleChange}
                required
              />

              <InputField
                label="Upload Image"
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Difficulty Level
                </label>
                <select
                  name="difficultyLevel"
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.difficultyLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Create Class
              </button>
            </form>
          </div>
        </div>
      </main>

      <ToastComponent />
    </div>
  );
};

export default AddClass;

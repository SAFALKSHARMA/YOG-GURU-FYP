import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../../ui/InputField";
import { AppContent } from "../../context/AppContext";
import ToastComponent from "../../ui/ToastComponent";

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
    formData.append("upload_preset", uploadPreset); // Replace with your Cloudinary preset
    formData.append("cloud_name", cloudName); // Replace with your Cloudinary cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url; // Get the Cloudinary image URL
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
      console.log("Uploading image:", formData.image); // Log the image being uploaded
      imageUrl = await uploadImageToCloudinary(formData.image);
      if (!imageUrl) return; // Stop if image upload fails
      console.log("Image URL after upload:", imageUrl); // Log the image URL received
    }

    // Convert 24-hour time format to 12-hour with AM/PM
    const [hours, minutes] = formData.time.split(":");
    const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    const period = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${formattedHours}:${minutes} ${period}`;

    const submissionData = {
      ...formData,
      time: formattedTime,
      image: imageUrl, // Cloudinary image URL
      instructorId: instructorData._id,
    };

    console.log("Final submission data:", submissionData); // Log the entire data being sent

    try {
      const response = await fetch("http://localhost:3000/api/classes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData), // Send imageUrl and other form data
      });

      const result = await response.json();
      console.log("API Response:", result); // Log the response from the API

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
        toast.error("Failed to add class. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong! Try again later.");
    }
  };

  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Class</h1>
        <div className="bg-white rounded-lg p-6 shadow-sm max-w-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <InputField
              label="Class Name"
              type="text"
              name="className"
              placeholder="Enter class name"
              onChange={handleChange}
            />
            <InputField
              label="Description"
              type="textarea"
              name="description"
              placeholder="Enter class description"
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Date"
                type="date"
                name="date"
                onChange={handleChange}
              />
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  step="60"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Duration (minutes)"
                type="number"
                name="duration"
                placeholder="60"
                onChange={handleChange}
              />
              <InputField
                label="Capacity"
                type="number"
                name="capacity"
                placeholder="20"
                onChange={handleChange}
              />
            </div>

            <InputField
              label="Total Duration"
              type="text"
              name="totalDuration"
              placeholder="e.g., 1 month, 2 months"
              onChange={handleChange}
            />
            <InputField
              label="Price"
              type="number"
              name="price"
              placeholder="Enter price"
              onChange={handleChange}
            />
            <InputField
              label="Class Link"
              type="url"
              name="classLink"
              placeholder="Enter class link"
              onChange={handleChange}
            />
            <InputField
              label="Upload Image"
              type="file"
              name="image"
              onChange={handleChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                name="difficultyLevel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onChange={handleChange}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Class
            </button>
          </form>
        </div>
      </div>

      <ToastComponent />
    </>
  );
};

export default AddClass;

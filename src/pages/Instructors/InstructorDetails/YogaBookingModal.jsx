import React, { useContext, useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Home,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { AppContent } from "../../../context/AppContext";

const YogaBookingModal = ({ isOpen, setIsOpen, instructorId }) => {
  const { userData } = useContext(AppContent);
  const [location, setLocation] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    preferredDate: "",
    preferredTime: "",
    sessionDuration: "",
    sessionLocation: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    yogaType: "",
    remarks: "",
    userId: userData?.userId || "", // Add userId from userData
    instructorId: instructorId, // Add instructorId from props
  });

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        fullName: userData.name || "",
        email: userData.email || "",
        userId: userData.userId || "", // Ensure userId is set
      }));
    }
  }, [userData]);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "sessionLocation") setLocation(value);
  };

  const formatTimeToAMPM = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":");
    const h = parseInt(hour);
    const period = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,
      formattedDate: formData.preferredDate
        ? new Date(formData.preferredDate).toLocaleDateString()
        : "",
      formattedTime: formatTimeToAMPM(formData.preferredTime),
      userId: userData?.userId, // Ensure userId is included
      instructorId: instructorId, // Ensure instructorId is included
    };

    console.log("✅ Sending form data to backend...");
    console.table(formattedData);

    try {
      const response = await fetch(
        "http://localhost:3000/api/bookings/yoga-booking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Booking submitted successfully:", result);

      setIsOpen(false); // Close modal
    } catch (error) {
      console.error("❌ Error submitting booking:", error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto transform transition-all duration-300 ease-in-out">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Book Your Yoga Session
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <User size={16} /> <span className="ml-2">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                readOnly
                placeholder="Your full name"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Mail size={16} /> <span className="ml-2">Email</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                readOnly
                placeholder="Your email address"
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Phone size={16} /> <span className="ml-2">Phone Number</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            {/* Preferred Date */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar size={16} />
                <span className="ml-2">Preferred Date</span>
              </label>
              <input
                type="date"
                name="preferredDate"
                required
                min={today}
                value={formData.preferredDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            {/* Preferred Time */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock size={16} />
                <span className="ml-2">Preferred Time</span>
              </label>
              <input
                type="time"
                name="preferredTime"
                required
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            {/* Yoga Type */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Calendar size={16} />
                <span className="ml-2">Yoga Type</span>
              </label>
              <input
                type="text"
                name="yogaType"
                required
                value={formData.yogaType}
                onChange={handleChange}
                placeholder="E.g., Hatha, Vinyasa, etc."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock size={16} className="mr-2" /> Session Duration
              </label>
              <select
                name="sessionDuration"
                required
                value={formData.sessionDuration}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="" disabled>
                  Select Duration
                </option>
                <option value="30">30 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin size={16} className="mr-2" /> Session Location
              </label>
              <select
                name="sessionLocation"
                required
                value={formData.sessionLocation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="" disabled>
                  Select Location
                </option>
                <option value="instructor">Instructor's Home</option>
                <option value="customer">Customer's Home</option>
              </select>
            </div>

            {/* Address Fields (only if "customer" selected) */}
            {location === "customer" && (
              <div className="border-t border-gray-200 pt-4 space-y-4">
                {[
                  {
                    label: "Street Address",
                    name: "streetAddress",
                    icon: <Home size={16} />,
                    placeholder: "Your street address",
                  },
                  {
                    label: "City",
                    name: "city",
                    icon: <MapPin size={16} />,
                    placeholder: "Your city",
                  },
                  {
                    label: "Zip Code",
                    name: "zipCode",
                    icon: <MapPin size={16} />,
                    placeholder: "Your zip/postal code",
                  },
                ].map(({ label, name, icon, placeholder }) => (
                  <div key={name} className="space-y-1">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      {icon} <span className="ml-2">{label}</span>
                    </label>
                    <input
                      type="text"
                      name={name}
                      required
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Additional Remarks */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FileText size={16} className="mr-2" /> Additional Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Any special requests or notes"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black min-h-[100px]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Book Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default YogaBookingModal;

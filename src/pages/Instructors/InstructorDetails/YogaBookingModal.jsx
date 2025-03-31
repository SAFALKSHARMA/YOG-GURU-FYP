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

const YogaBookingModal = ({ isOpen, setIsOpen }) => {
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
  });

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        fullName: userData.name || "",
        email: userData.email || "",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "sessionLocation") setLocation(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsOpen(false);
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
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700"
              />
            </div>

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
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-700"
              />
            </div>

            {[
              {
                label: "Phone Number",
                name: "phoneNumber",
                type: "tel",
                icon: <Phone size={16} />,
              },
              {
                label: "Preferred Date",
                name: "preferredDate",
                type: "date",
                icon: <Calendar size={16} />,
              },
              {
                label: "Preferred Time",
                name: "preferredTime",
                type: "time",
                icon: <Clock size={16} />,
              },
              {
                label: "Yoga Type",
                name: "yogaType",
                type: "text",
                icon: <Calendar size={16} />,
              },
            ].map(({ label, name, type, icon }) => (
              <div key={name} className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  {icon} <span className="ml-2">{label}</span>
                </label>
                <input
                  type={type}
                  name={name}
                  required
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}

            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock size={16} className="mr-2" /> Session Duration
              </label>
              <select
                name="sessionDuration"
                required
                value={formData.sessionDuration}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Duration</option>
                <option value="30">30 min</option>
                <option value="60">60 min</option>
                <option value="90">90 min</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MapPin size={16} className="mr-2" /> Session Location
              </label>
              <select
                name="sessionLocation"
                required
                value={formData.sessionLocation}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Location</option>
                <option value="instructor">Instructor's Home</option>
                <option value="customer">Customer's Home</option>
              </select>
            </div>

            {location === "customer" && (
              <div className="border-t border-gray-200 pt-4 space-y-4">
                {[
                  {
                    label: "Street Address",
                    name: "streetAddress",
                    icon: <Home size={16} />,
                  },
                  { label: "City", name: "city", icon: <MapPin size={16} /> },
                  {
                    label: "Zip Code",
                    name: "zipCode",
                    icon: <MapPin size={16} />,
                  },
                ].map(({ label, name, icon }) => (
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
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}

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

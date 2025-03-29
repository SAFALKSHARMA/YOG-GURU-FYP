import { useContext, useState, useEffect } from "react";
import { AppContent } from "../../context/AppContext";

export default function InstructorApplicationForm() {
  const { userData } = useContext(AppContent);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    qualifications: "",
    bio: "",
    image: null,
    serviceType: [],
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userData?.email) {
      setFormData((prevData) => ({
        ...prevData,
        email: userData.email,
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleServiceTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updatedServices = checked
        ? [...prevData.serviceType, value]
        : prevData.serviceType.filter((service) => service !== value);
      return { ...prevData, serviceType: updatedServices };
    });
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);

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
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";
    if (formData.image) {
      imageUrl = await uploadImageToCloudinary(formData.image);
      if (!imageUrl) {
        setMessage("Error uploading image");
        return;
      }
    }

    const formDataToSend = {
      ...formData,
      image: imageUrl,
    };
    delete formDataToSend.imageFile;

    try {
      const response = await fetch(
        "http://localhost:3000/api/instructors/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Application submitted successfully!");
        setFormData({
          fullName: "",
          email: userData.email,
          phone: "",
          experience: "",
          qualifications: "",
          bio: "",
          image: null,
          serviceType: [],
        });
      } else {
        setMessage(data.message || "Error submitting application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setMessage("Error submitting application");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Apply to be an Instructor</h2>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          readOnly
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="experience"
          placeholder="Years of Experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="qualifications"
          placeholder="Specialized Yoga"
          value={formData.qualifications}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <div className="space-y-2">
          <label className="block font-semibold">Service Type:</label>
          {["Online Yoga", "Customer Home", "Instructor Home"].map(
            (service) => (
              <div key={service} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={service}
                  checked={formData.serviceType.includes(service)}
                  onChange={handleServiceTypeChange}
                />
                <span>{service}</span>
              </div>
            )
          )}
        </div>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}

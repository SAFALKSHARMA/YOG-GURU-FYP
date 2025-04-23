import { useContext, useState, useEffect } from "react";
import { AppContent } from "../../context/AppContext";
import { toast } from "react-toastify";

export default function InstructorApplicationForm() {
  const { userData, backendUrl } = useContext(AppContent);

  const [formData, setFormData] = useState({
    fullName: "",
    email: userData?.email || "",
    phone: "",
    experience: "",
    qualifications: "",
    bio: "",
    serviceType: [],
    userId: userData?.userId || "", // Add userId to formData
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        email: userData.email || "",
        userId: userData.userId || "",
      }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleFilesChange = (e, setFiles, files) => {
    const newFiles = Array.from(e.target.files).filter(
      (file) => !files.some((f) => f.name === file.name)
    );
    const fileObjects = newFiles.map((file) => ({
      file,
      name: file.name,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      type: file.type,
    }));
    setFiles([...files, ...fileObjects]);
  };

  const handleRemoveFile = (index, files, setFiles) => {
    const updated = [...files];
    if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleServiceTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      serviceType: checked
        ? [...prev.serviceType, value]
        : prev.serviceType.filter((s) => s !== value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }
    if (!formData.experience) {
      newErrors.experience = "Experience is required";
      isValid = false;
    }
    if (!formData.qualifications.trim()) {
      newErrors.qualifications = "Qualifications are required";
      isValid = false;
    }
    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
      isValid = false;
    }
    if (formData.serviceType.length === 0) {
      newErrors.serviceType = "Select at least one service type";
      isValid = false;
    }
    if (!image) {
      newErrors.image = "Profile image is required";
      isValid = false;
    }
    if (documents.length === 0) {
      newErrors.documents = "At least one document is required";
      isValid = false;
    }
    if (certificates.length === 0) {
      newErrors.certificates = "At least one certificate is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "serviceType") {
          value.forEach((v) => formDataToSend.append("serviceType", v));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append files
      if (image) formDataToSend.append("image", image);
      documents.forEach((doc) => formDataToSend.append("documents", doc.file));
      certificates.forEach((cert) =>
        formDataToSend.append("certificates", cert.file)
      );

      const response = await fetch(`${backendUrl}/api/instructors/apply`, {
        method: "POST",
        body: formDataToSend,
        // Don't set Content-Type header - let the browser set it with boundary
      });

      if (!response.ok) {
        // Handle non-JSON responses
        if (
          !response.headers.get("content-type")?.includes("application/json")
        ) {
          const text = await response.text();
          throw new Error(`Server responded with: ${text}`);
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      const data = await response.json();
      toast.success(data.message || "Application submitted successfully!");

      // Reset form
      setFormData({
        fullName: "",
        email: userData?.email || "",
        phone: "",
        experience: "",
        qualifications: "",
        bio: "",
        serviceType: [],
        userId: userData?.userId || "",
      });
      setImage(null);
      setImagePreview(null);
      setDocuments([]);
      setCertificates([]);
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      documents.forEach(
        (doc) => doc.preview && URL.revokeObjectURL(doc.preview)
      );
      certificates.forEach(
        (cert) => cert.preview && URL.revokeObjectURL(cert.preview)
      );
      imagePreview && URL.revokeObjectURL(imagePreview);
    };
  }, [documents, certificates, imagePreview]);

  const getFileTypeIndicator = (preview, name) => {
    const ext = name.split(".").pop().toLowerCase();
    const imageExt = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

    return imageExt.includes(ext) && preview ? (
      <img
        src={preview}
        alt="Preview"
        className="h-20 w-20 object-cover rounded border"
      />
    ) : (
      <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded border">
        <svg
          className="w-10 h-10 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Apply to be an Instructor</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full p-3 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {errors.experience && (
                <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialized Yoga/Qualifications
            </label>
            <input
              type="text"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.qualifications && (
              <p className="mt-1 text-sm text-red-600">
                {errors.qualifications}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
              required
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Types
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {["Online Yoga", "Customer Home", "Instructor Home"].map(
                (service) => (
                  <div key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`service-${service}`}
                      value={service}
                      checked={formData.serviceType.includes(service)}
                      onChange={handleServiceTypeChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`service-${service}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {service}
                    </label>
                  </div>
                )
              )}
            </div>
            {errors.serviceType && (
              <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {imagePreview && (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={imagePreview}
                  className="h-24 w-24 object-cover rounded-full border-2 border-gray-200"
                  alt="Preview"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove Image
                </button>
              </div>
            )}
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documents (ID Proof, etc.)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFilesChange(e, setDocuments, documents)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              {documents.map((doc, index) => (
                <div key={index} className="relative group">
                  {getFileTypeIndicator(doc.preview, doc.name)}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFile(index, documents, setDocuments)
                    }
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-700"
                  >
                    ×
                  </button>
                  <p className="mt-1 text-xs text-gray-500 truncate">
                    {doc.name}
                  </p>
                </div>
              ))}
            </div>
            {errors.documents && (
              <p className="mt-1 text-sm text-red-600">{errors.documents}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificates
            </label>
            <input
              type="file"
              multiple
              onChange={(e) =>
                handleFilesChange(e, setCertificates, certificates)
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              {certificates.map((cert, index) => (
                <div key={index} className="relative group">
                  {getFileTypeIndicator(cert.preview, cert.name)}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveFile(index, certificates, setCertificates)
                    }
                    className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-700"
                  >
                    ×
                  </button>
                  <p className="mt-1 text-xs text-gray-500 truncate">
                    {cert.name}
                  </p>
                </div>
              ))}
            </div>
            {errors.certificates && (
              <p className="mt-1 text-sm text-red-600">{errors.certificates}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData?.email) {
      setFormData((prevData) => ({ ...prevData, email: userData.email }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
    e.target.value = null;
  };

  const handleRemoveFile = (index, files, setFiles) => {
    const updated = [...files];
    if (updated[index].preview) URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleServiceTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const updated = checked
        ? [...prevData.serviceType, value]
        : prevData.serviceType.filter((s) => s !== value);
      return { ...prevData, serviceType: updated };
    });
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
    if (!formData.experience.trim()) {
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
      toast.error("Profile image is required");
      isValid = false;
    }
    if (documents.length === 0) {
      toast.error("At least one document is required");
      isValid = false;
    }
    if (certificates.length === 0) {
      toast.error("At least one certificate is required");
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
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "serviceType") {
          value.forEach((v) => formDataToSend.append("serviceType", v));
        } else {
          formDataToSend.append(key, value);
        }
      });

      formDataToSend.append("image", image);
      documents.forEach((doc) => formDataToSend.append("documents", doc.file));
      certificates.forEach((cert) =>
        formDataToSend.append("certificates", cert.file)
      );

      const response = await fetch(`${backendUrl}/api/instructors/apply`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Application submitted successfully!");
        setFormData({
          fullName: "",
          email: userData?.email || "",
          phone: "",
          experience: "",
          qualifications: "",
          bio: "",
          serviceType: [],
        });
        setImage(null);
        setImagePreview(null);
        documents.forEach(
          (doc) => doc.preview && URL.revokeObjectURL(doc.preview)
        );
        certificates.forEach(
          (cert) => cert.preview && URL.revokeObjectURL(cert.preview)
        );
        setDocuments([]);
        setCertificates([]);
        setErrors({});
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      documents.forEach(
        (doc) => doc.preview && URL.revokeObjectURL(doc.preview)
      );
      certificates.forEach(
        (cert) => cert.preview && URL.revokeObjectURL(cert.preview)
      );
    };
  }, [documents, certificates]);

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
          ></path>
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Apply to be an Instructor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              name="experience"
              placeholder="Years of Experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.experience && (
              <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
            )}
          </div>
        </div>

        <input
          type="text"
          name="qualifications"
          placeholder="Specialized Yoga"
          value={formData.qualifications}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        {errors.qualifications && (
          <p className="text-red-500 text-xs mt-1">{errors.qualifications}</p>
        )}

        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          className="w-full p-2 border rounded h-24"
        />
        {errors.bio && (
          <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
        )}

        <div>
          <label className="block font-semibold">Service Type:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {["Online Yoga", "Customer Home", "Instructor Home"].map(
              (service) => (
                <div key={service} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={service}
                    checked={formData.serviceType.includes(service)}
                    onChange={handleServiceTypeChange}
                    id={`service-${service}`}
                  />
                  <label htmlFor={`service-${service}`}>{service}</label>
                </div>
              )
            )}
          </div>
          {errors.serviceType && (
            <p className="text-red-500 text-xs mt-1">{errors.serviceType}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Profile Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            required={!image}
          />
          {imagePreview && (
            <div className="mt-2 flex items-center gap-4">
              <img
                src={imagePreview}
                className="h-24 w-24 object-cover rounded-full border-2"
                alt="Preview"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block font-semibold">Upload Documents:</label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFilesChange(e, setDocuments, documents)}
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {documents.map((doc, index) => (
              <div key={index} className="relative">
                {getFileTypeIndicator(doc.preview, doc.name)}
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveFile(index, documents, setDocuments)
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold">Upload Certificates:</label>
          <input
            type="file"
            multiple
            onChange={(e) =>
              handleFilesChange(e, setCertificates, certificates)
            }
            className="w-full p-2 border rounded"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {certificates.map((cert, index) => (
              <div key={index} className="relative">
                {getFileTypeIndicator(cert.preview, cert.name)}
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveFile(index, certificates, setCertificates)
                  }
                  className="absolute top-0 right-0 bg-red-500 text-white w-6 h-6 rounded-full"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

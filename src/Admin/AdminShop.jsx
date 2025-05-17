import { useState } from "react";
import {
  Save,
  PlusCircle,
  Trash2,
  Tag,
  FileText,
  Package,
  Upload,
  X,
} from "lucide-react";
import Sidebar from "./Sidebar"; // Import your existing Sidebar component

const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  textarea,
  icon: Icon,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Icon size={16} />
        </div>
      )}
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border ${
            error ? "border-red-300" : "border-gray-300"
          } rounded-lg py-2 px-3 ${
            Icon ? "pl-10" : ""
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          rows={4}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full border ${
            error ? "border-red-300" : "border-gray-300"
          } rounded-lg py-2 px-3 ${
            Icon ? "pl-10" : ""
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      )}
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const NumberInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required,
  currency,
  step,
  icon: Icon,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Icon size={16} />
        </div>
      )}
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        step={step}
        className={`w-full border ${
          error ? "border-red-300" : "border-gray-300"
        } rounded-lg py-2 px-3 ${
          Icon ? "pl-10" : ""
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full border ${
        error ? "border-red-300" : "border-gray-300"
      } rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const FileUploadInput = ({
  images,
  handleFileChange,
  addImageField,
  removeImageField,
  error,
}) => {
  const [previews, setPreviews] = useState([]);

  const handleChange = (index, files) => {
    if (files && files[0]) {
      const file = files[0];
      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
      handleFileChange(index, file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((_, index) => (
          <div key={index} className="relative">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {previews[index] ? (
                <div className="relative">
                  <img
                    src={previews[index]}
                    alt="Preview"
                    className="h-40 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-white rounded-full p-2 text-blue-600 hover:text-blue-800">
                      <Upload size={20} />
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleChange(index, e.target.files)}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload image</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleChange(index, e.target.files)}
                  />
                </label>
              )}
            </div>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => removeImageField(index)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 hover:text-red-700 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addImageField}
          className="flex flex-col items-center justify-center h-40 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <PlusCircle className="h-8 w-8 text-blue-500 mb-2" />
          <p className="text-sm text-gray-500">Add image</p>
        </button>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const AdminShop = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "0",
    imageFiles: [null],
    brand: "",
    color: "",
    material: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleFileChange = (index, file) => {
    const updatedFiles = [...formData.imageFiles];
    updatedFiles[index] = file;
    setFormData({
      ...formData,
      imageFiles: updatedFiles,
    });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      imageFiles: [...formData.imageFiles, null],
    });
  };

  const removeImageField = (index) => {
    const updatedFiles = [...formData.imageFiles];
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      imageFiles: updatedFiles.length ? updatedFiles : [null],
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative number";
    }

    const emptyImageIndex = formData.imageFiles.findIndex(
      (file) => file === null
    );
    if (emptyImageIndex !== -1) {
      newErrors.images = `Please upload an image for position ${
        emptyImageIndex + 1
      }`;
    }

    return newErrors;
  };

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
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

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const imageUploadPromises = formData.imageFiles.map((file) =>
        uploadImageToCloudinary(file)
      );
      const imageUrls = await Promise.all(imageUploadPromises);

      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        brand: formData.brand,
        color: formData.color,
        material: formData.material,
        images: imageUrls,
      };

      const response = await fetch("http://localhost:3000/api/shop/add-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save product");
      }

      const responseData = await response.json();

      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        stock: "0",
        imageFiles: [null],
        brand: "",
        color: "",
        material: "",
      });

      setSuccessMessage(
        responseData.message || "Yoga accessory added successfully!"
      );
    } catch (error) {
      console.error("Error adding accessory:", error);
      setErrors({
        submit: error.message || "Failed to add accessory. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: "Mat", label: "Mat" },
    { value: "Block", label: "Block" },
    { value: "Strap", label: "Strap" },
    { value: "Bolster", label: "Bolster" },
    { value: "Towel", label: "Towel" },
    { value: "Clothing", label: "Clothing" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Your existing Sidebar component */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Product
            </h1>
            <p className="text-gray-500">
              Create a new yoga accessory in your inventory
            </p>
          </header>

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
              {successMessage}
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <TextInput
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Yoga Mat Premium"
                    error={errors.name}
                    required
                    icon={Tag}
                  />

                  <TextInput
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="A premium quality yoga mat with extra cushioning..."
                    error={errors.description}
                    required
                    textarea
                    icon={FileText}
                  />

                  <SelectInput
                    label="Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categoryOptions}
                    error={errors.category}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Pricing & Inventory
                  </h2>
                  <div className="space-y-4">
                    <NumberInput
                      label="Price ($)"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="29.99"
                      error={errors.price}
                      required
                      step="0.01"
                    />

                    <NumberInput
                      label="Stock Quantity"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="100"
                      error={errors.stock}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Product Details
                  </h2>
                  <div className="space-y-4">
                    <TextInput
                      label="Brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="YogaEssentials"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        label="Color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="Purple"
                      />

                      <TextInput
                        label="Material"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        placeholder="TPE Foam"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Product Images
                </h2>
                <FileUploadInput
                  images={formData.imageFiles}
                  handleFileChange={handleFileChange}
                  addImageField={addImageField}
                  removeImageField={removeImageField}
                  error={errors.images}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg font-medium flex items-center ${
                  isSubmitting
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-4 w-4"
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={16} /> Save Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminShop;

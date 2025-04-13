import { useState } from "react";
import {
  Save,
  PlusCircle,
  Trash2,
  Tag,
  FileText,
  Layers,
  DollarSign,
  Package,
  Images,
  BookOpen,
  Palette,
  Feather,
  Upload,
  Image,
} from "lucide-react";
import { TextInput, SelectInput, NumberInput } from "../ui/InputComponents";

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
      // Update previews
      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);

      // Pass file to parent component
      handleFileChange(index, file);
    }
  };

  return (
    <div className="space-y-3">
      {images.map((_, index) => (
        <div key={index} className="flex items-start">
          <div className="flex-grow">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
              {previews[index] ? (
                <div className="relative">
                  <div className="mb-2 max-w-xs mx-auto">
                    <img
                      src={previews[index]}
                      alt="Preview"
                      className="h-32 object-contain mx-auto rounded"
                    />
                  </div>
                  <label className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center">
                    <Upload size={16} className="mr-1" />
                    Change image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleChange(index, e.target.files)}
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center py-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleChange(index, e.target.files)}
                  />
                </label>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeImageField(index)}
            disabled={images.length === 1}
            className={`ml-2 p-2 rounded-lg ${
              images.length === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            } transition-colors`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <Trash2 size={14} className="mr-1" />
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={addImageField}
        className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        <PlusCircle className="mr-2" size={18} /> Add Another Image
      </button>
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
    formData.append("upload_preset", uploadPreset); // Replace with your upload preset
    formData.append("cloud_name", cloudName); // Replace with your cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, // Replace with your cloud name
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url; // Return the secure URL of the uploaded image
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
      // Upload all images to Cloudinary first
      const imageUploadPromises = formData.imageFiles.map((file) =>
        uploadImageToCloudinary(file)
      );
      const imageUrls = await Promise.all(imageUploadPromises);

      // Prepare the data to send to your backend
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        brand: formData.brand,
        color: formData.color,
        material: formData.material,
        images: imageUrls, // Array of Cloudinary URLs
      };

      // Send data to your backend API
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

      // Reset form on success
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
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <Package className="mr-2" size={24} /> Add New Yoga Accessory
          </h1>
          <p className="mt-1 text-indigo-100">
            Fill in the details to add a new item to your inventory
          </p>
        </div>

        <div className="p-6 md:p-8">
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md flex items-center">
              <PlusCircle className="mr-3 text-green-500" size={20} />
              <span>{successMessage}</span>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center">
              <Trash2 className="mr-3 text-red-500" size={20} />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <BookOpen className="mr-2 text-indigo-500" size={20} /> Basic
                Information
              </h2>

              <div className="space-y-4">
                <TextInput
                  label="Name"
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
                  placeholder="A premium quality yoga mat with extra cushioning for comfort..."
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

            {/* Inventory Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Package className="mr-2 text-indigo-500" size={20} /> Inventory
                Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NumberInput
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="29.99"
                  error={errors.price}
                  required
                  currency
                  step="0.01"
                  icon={DollarSign}
                />

                <NumberInput
                  label="Stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="100"
                  error={errors.stock}
                  required
                  icon={Package}
                />
              </div>
            </div>

            {/* Product Details Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Feather className="mr-2 text-indigo-500" size={20} /> Product
                Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextInput
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="YogaEssentials"
                  icon={Tag}
                />

                <TextInput
                  label="Color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Purple"
                  icon={Palette}
                />

                <TextInput
                  label="Material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  placeholder="TPE Foam"
                  icon={Layers}
                />
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Images className="mr-2 text-indigo-500" size={20} /> Product
                Images
              </h2>

              <div className="mb-2 flex items-center text-sm font-medium text-gray-700">
                <Image className="mr-2 text-indigo-500" size={16} /> Images{" "}
                <span className="text-red-500 ml-1">*</span>
              </div>

              <FileUploadInput
                images={formData.imageFiles}
                handleFileChange={handleFileChange}
                addImageField={addImageField}
                removeImageField={removeImageField}
                error={errors.images}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 flex items-center justify-center border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Adding Product...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={20} /> Add Yoga Accessory
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

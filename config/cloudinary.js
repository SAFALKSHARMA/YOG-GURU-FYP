// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for multer
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_images", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional: Resize images
  },
});

export default cloudinary;

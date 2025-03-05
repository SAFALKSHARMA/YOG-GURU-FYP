import express from "express";
import {
  submitApplication,
  getApplications,
  approveInstructor,
  rejectInstructor,
} from "../controllers/instructorController.js";
import multer from "multer";
import storage from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage }); // Use Cloudinary storage for multer

router.post("/apply", upload.single("image"), submitApplication); // Submit application
router.get("/applications", getApplications); // Get all applications (for admin)

router.put("/approve/:instructorId", approveInstructor);
router.put("/reject/:instructorId", rejectInstructor); // Ensure this route exists!

export default router;

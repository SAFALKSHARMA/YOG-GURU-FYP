import express from "express";
import {
  submitApplication,
  getApplications,
  approveInstructor,
  rejectInstructor,
  getAllInstructors,
  getInstructorById,
} from "../controllers/instructorController.js";
import { upload } from "../config/cloudinary.js"; // Use the uploaded middleware directly

const router = express.Router();

router.post(
  "/apply",
  upload.fields([
    // Specify multiple fields
    { name: "image", maxCount: 1 },
    { name: "documents", maxCount: 10 },
    { name: "certificates", maxCount: 10 },
  ]),
  submitApplication // Controller function
);

router.get("/applications", getApplications); // Get all applications (for admin)

router.put("/approve/:applicationId", approveInstructor);
router.put("/reject/:applicationId", rejectInstructor); // Ensure this route exists!

// Route to fetch all instructors (including their classes)
router.get("/all-instructors", getAllInstructors);
router.get("/:instructorId", getInstructorById);
export default router;

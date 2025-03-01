import express from "express";
import {
  submitApplication,
  getApplications,
  approveInstructor,
  rejectInstructor,
} from "../controllers/instructorController.js";

const router = express.Router();

router.post("/apply", submitApplication); // Submit application
router.get("/applications", getApplications); // Get all applications (for admin)

router.put("/approve/:instructorId", approveInstructor);
router.put("/reject/:instructorId", rejectInstructor); // Ensure this route exists!

export default router;

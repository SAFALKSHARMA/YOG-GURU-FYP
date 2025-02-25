import express from "express";
import {
  submitApplication,
  getApplications,
  updateApplicationStatus,
} from "../controllers/instructorController.js";

const router = express.Router();

router.post("/apply", submitApplication); // Submit application
router.get("/applications", getApplications); // Get all applications (for admin)
router.put("/applications/:id", updateApplicationStatus); // Approve/reject application

export default router;

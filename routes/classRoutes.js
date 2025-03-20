import express from "express";
import {
  createClass,
  getAllClasses,
  updateClassStatus,
  getClassDetails,
} from "../controllers/classController.js";

const router = express.Router();

// Route to create a class
router.post("/create", createClass);
router.get("/all-classes", getAllClasses);
router.put("/update-status", updateClassStatus); // Use the controller function
router.get("/:classId", getClassDetails);

export default router;

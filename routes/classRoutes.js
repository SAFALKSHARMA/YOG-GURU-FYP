import express from "express";
import {
  createClass,
  getAllClasses,
  updateClassStatus,
} from "../controllers/classController.js";

const router = express.Router();

// Route to create a class
router.post("/create", createClass);
// Route to fetch all classes from all instructors
router.get("/all-classes", getAllClasses);
router.put("/update-status", updateClassStatus); // Use the controller function

export default router;

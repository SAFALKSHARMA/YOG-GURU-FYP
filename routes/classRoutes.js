import express from "express";
import {
  createClass,
  getAllClasses,
  updateClassStatus,
  getClassDetails,
  getFavoriteClasses,
  toggleFavorite,
  enrollUserInClass,
  getEnrolledClasses,
} from "../controllers/classController.js";

const router = express.Router();

// Route to create a class
router.post("/create", createClass);
router.get("/all-classes", getAllClasses);
router.put("/update-status", updateClassStatus); // Use the controller function
router.get("/:classId", getClassDetails);
router.post("/toggle-favorites", toggleFavorite);
router.get("/:userId/favorites", getFavoriteClasses);
router.post("/enroll", enrollUserInClass);
router.get("/:userId/enrolled-classes", getEnrolledClasses);

export default router;

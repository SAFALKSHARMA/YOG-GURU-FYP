import express from "express";
import {
  createClass,
  getAllClasses,
  updateClassStatus,
  getClassDetails,
  getFavoriteClasses,
  enrollUserInClass,
  getEnrolledClasses,
  updateClass,
  deleteClass,
  getAllClassApplications,
  getInstructorClasses,
  toggleFavorite,
} from "../controllers/classController.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Route to create a class
router.post("/create", createClass);
router.get("/all-classes", getAllClasses);
router.get("/applications", getAllClassApplications);

router.put("/update-status", updateClassStatus); // Use the controller function
router.get("/:classId", getClassDetails);
router.post("/toggle-favorite", toggleFavorite);
router.get("/:userId/favorites", getFavoriteClasses);
router.post("/enroll", enrollUserInClass);
router.get("/:userId/enrolled-classes", getEnrolledClasses);
router.put("/:classId", upload.single("image"), updateClass);
router.delete("/delete-class", deleteClass);
router.get("/instructor/:instructorId", getInstructorClasses);

export default router;

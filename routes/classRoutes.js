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
  updateClass,
  deleteClass,
  getAllClassApplications,
} from "../controllers/classController.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Route to create a class
router.post("/create", createClass);
router.get("/all-classes", getAllClasses);
router.get("/applications", getAllClassApplications);

router.put("/update-status", updateClassStatus); // Use the controller function
router.get("/:classId", getClassDetails);
router.post("/toggle-favorites", toggleFavorite);
router.get("/:userId/favorites", getFavoriteClasses);
router.post("/enroll", enrollUserInClass);
router.get("/:userId/enrolled-classes", getEnrolledClasses);
router.put("/:_id", upload.single("image"), updateClass);
router.delete("/delete-class", deleteClass);

export default router;

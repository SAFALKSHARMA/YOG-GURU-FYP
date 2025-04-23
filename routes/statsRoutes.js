import express from "express";
import {
  getAdminDashboard,
  getInstructorDashboardData,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/admin-dashboard", getAdminDashboard);
router.get("/:instructorId", getInstructorDashboardData);

export default router;

import express from "express";
import {
  createYogaBooking,
  getInstructorBookings,
  updateBookingStatus,
  getBookingsByUserId,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/yoga-booking", createYogaBooking);
// Get all bookings for an instructor
router.get("/instructor/:instructorId", getInstructorBookings);
router.patch("/update-status", updateBookingStatus);
router.get("/", getBookingsByUserId);

export default router;

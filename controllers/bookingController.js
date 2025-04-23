import YogaBooking from "../models/booking.model.js";
import { sendBookingEmail } from "../config/nodemailer.js";

export const createYogaBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      preferredDate,
      preferredTime,
      formattedDate,
      formattedTime,
      sessionDuration,
      sessionLocation,
      streetAddress,
      city,
      zipCode,
      yogaType,
      remarks,
      userId,
      instructorId,
    } = req.body;

    // ✅ Basic validation
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !preferredDate ||
      !preferredTime ||
      !sessionDuration ||
      !sessionLocation ||
      !yogaType ||
      !userId ||
      !instructorId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // 🧠 Create new booking
    const newBooking = new YogaBooking({
      fullName,
      email,
      phoneNumber,
      preferredDate,
      preferredTime: formattedTime, // Store AM/PM version
      sessionDuration,
      sessionLocation,
      streetAddress,
      city,
      zipCode,
      yogaType,
      remarks,
      userId,
      instructorId,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Yoga session booked successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Booking failed.",
    });
  }
};

// Get all bookings for a specific instructor
export const getInstructorBookings = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const bookings = await YogaBooking.find({ instructorId })
      .populate({
        path: "userId",
        select: "image", // Include user details
      })
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((booking) => ({
      ...booking.toObject(),
      user: {
        image: booking.userId?.profileImage,
        name: `${booking.userId?.firstName} ${booking.userId?.lastName}`,
      },
    }));

    res.status(200).json({
      success: true,
      count: formattedBookings.length,
      data: formattedBookings,
    });
  } catch (error) {
    console.error("Error fetching instructor bookings:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, instructorId } = req.body;

    if (!bookingId || !status || !instructorId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID, status, and instructor ID are required",
      });
    }

    const booking = await YogaBooking.findOne({
      _id: bookingId,
      instructorId: instructorId,
    })
      .populate("userId", "email name")
      .populate("instructorId", "fullName email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or instructor mismatch",
      });
    }

    const validTransitions = {
      Pending: ["Approved", "Rejected"],
      Approved: ["Completed", "Cancelled"],
      Rejected: [],
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`,
        validTransitions: validTransitions[booking.status] || [],
      });
    }

    const previousStatus = booking.status;
    booking.status = status;
    const updatedBooking = await booking.save();

    if (["Approved", "Rejected"].includes(status)) {
      sendBookingEmail(
        status.toLowerCase(),
        {
          _id: booking._id,
          fullName: booking.userId.name,
          preferredDate: booking.preferredDate,
          preferredTime: booking.preferredTime,
          sessionDuration: booking.sessionDuration,
          yogaType: booking.yogaType,
          sessionLocation: booking.sessionLocation,
          remarks: booking.remarks,
        },
        {
          _id: booking.instructorId._id,
          name: booking.instructorId.fullName,
          email: booking.instructorId.email,
        },
        booking.userId.email
      ).catch((error) => {
        console.error("Email sending failed:", error);
      });
    }

    console.log(
      `Booking ${bookingId} status changed from ${previousStatus} to ${status}`
    );

    res.status(200).json({
      success: true,
      data: updatedBooking,
      changes: {
        from: previousStatus,
        to: status,
        at: new Date(),
      },
    });
  } catch (error) {
    console.error("Booking status update error:", {
      error: error.message,
      stack: error.stack,
      request: req.body,
    });

    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

export const getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const bookings = await YogaBooking.find({ userId })
      .populate("instructorId", "fullName image email phone")
      .sort({ createdAt: -1 }); // Optional: show latest first

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

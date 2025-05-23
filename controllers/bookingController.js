import YogaBooking from "../models/booking.model.js";
import { bookingStatusTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/emailTemplates.js";
import Instructor from "../models/Instructor.js";
import { sendWhatsAppMessage } from "../utils/sendWhatsappMsg.js";

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
      status: "Pending",
    });

    await newBooking.save();

    const instructor = await Instructor.findById(instructorId).select("phone");

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }
    // Send whatsapp message to instructor
    const message = `New Yoga Booking from ${fullName}.\n\nDetails:\n- Date: ${formattedDate}\n- Time: ${formattedTime}\n- Duration: ${sessionDuration}\n- Location: ${sessionLocation}\n- Address: ${streetAddress}, ${city}, ${zipCode}\n- Yoga Type: ${yogaType}\n- Remarks: ${remarks}`;
    await sendWhatsAppMessage(instructor.phone, message);

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
    const { bookingId, status, instructorId, rejectionReason } = req.body;

    // Basic validation
    if (!bookingId || !status || !instructorId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find booking
    const booking = await YogaBooking.findOne({
      _id: bookingId,
      instructorId: instructorId,
    })
      .populate("userId", "email name phone")
      .populate("instructorId", "fullName email");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check valid status change
    const allowedChanges = {
      Pending: ["Approved", "Rejected"],
      Approved: ["Completed", "Cancelled"],
      Rejected: [],
    };

    if (!allowedChanges[booking.status]?.includes(status)) {
      return res.status(400).json({
        error: `Cannot change from ${booking.status} to ${status}`,
      });
    }

    // Update booking
    const oldStatus = booking.status;
    booking.status = status;
    if (status === "Rejected") booking.rejectionReason = rejectionReason;
    await booking.save();

    // Send WhatsApp message to user of booking status with instructor details
    const userMessage = `Your booking status has been updated to ${status}.\n\nDetails:\n- Yoga Type: ${
      booking.yogaType
    }\n- Date: ${booking.preferredDate.toDateString()}\n- Time: ${
      booking.preferredTime
    }\n- Instructor: ${booking.instructorId.fullName}\n- Rejection Reason: ${
      booking.rejectionReason || "N/A"
    }`;
    await sendWhatsAppMessage(booking.userId.phone, userMessage);

    // Send email notification
    if (["Approved", "Rejected"].includes(status)) {
      const emailData = {
        status,
        userName: booking.userId.name,
        bookingDetails: {
          yogaType: booking.yogaType,
          preferredDate: booking.preferredDate.toDateString(),
          preferredTime: booking.preferredTime,
          rejectionReason: booking.rejectionReason,
        },
        instructor: {
          name: booking.instructorId.fullName,
        },
      };

      await sendEmail({
        to: booking.userId.email,
        subject: `Your Yoga Session - ${status}`,
        html: bookingStatusTemplate(emailData),
      });
    }

    // Return success
    res.json({
      success: true,
      message: `Status updated from ${oldStatus} to ${status}`,
      booking,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error" });
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

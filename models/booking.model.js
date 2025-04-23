import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String, // Stored in AM/PM format like "9:34 PM"
      required: true,
    },
    sessionDuration: {
      type: Number, // In minutes
      required: true,
      enum: [30, 60, 90],
    },
    sessionLocation: {
      type: String,
      enum: ["instructor", "customer"],
      required: true,
    },
    streetAddress: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    zipCode: {
      type: String,
      default: "",
    },
    yogaType: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const YogaBooking = mongoose.model("YogaBooking", bookingSchema);

export default YogaBooking;

import mongoose from "mongoose";

const instructorApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    experience: { type: Number, required: true },
    qualifications: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "InstructorApplication",
  instructorApplicationSchema
);

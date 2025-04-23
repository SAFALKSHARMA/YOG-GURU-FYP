import mongoose from "mongoose";
const { Schema } = mongoose;

const instructorApplicationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    experience: { type: Number, required: true },
    qualifications: { type: String, required: true },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    serviceType: { type: [String], required: true },
    documents: [{ type: String, required: true }],
    certificates: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.InstructorApplication ||
  mongoose.model("InstructorApplication", instructorApplicationSchema);

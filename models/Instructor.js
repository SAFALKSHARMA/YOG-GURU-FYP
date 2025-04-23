import mongoose from "mongoose";
const { Schema } = mongoose;

const instructorSchema = new Schema(
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
    serviceTypes: {
      type: [String],
      enum: ["Online Yoga", "Customer Home", "Instructor Home"],
      required: true,
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Instructor ||
  mongoose.model("Instructor", instructorSchema);

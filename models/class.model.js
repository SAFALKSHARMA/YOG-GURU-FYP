import mongoose from "mongoose";
const { Schema } = mongoose;

const classSchema = new Schema(
  {
    className: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: false },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    capacity: { type: Number, required: true },
    totalDuration: { type: String, required: true },
    price: { type: Number, required: true },
    classLink: { type: String, required: true },
    location: { type: String, required: false },
    image: { type: String, required: true },
    difficultyLevel: { type: String, required: true },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);
export default Class;

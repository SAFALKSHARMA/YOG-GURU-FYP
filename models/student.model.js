import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  enrolledDate: { type: Date, default: Date.now },
  image: { type: String, required: true },
});

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);

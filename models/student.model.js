import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  enrolledDate: { type: Date, default: Date.now },
});

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);

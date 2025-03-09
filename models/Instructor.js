import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

// Student schema for nested students list with image field
const studentSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  enrolledDate: { type: Date, default: Date.now },
  image: { type: String, required: true }, // Image field for student
});

// Class schema
const classSchema = new Schema({
  className: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  capacity: { type: Number, required: true },
  totalDuration: { type: String, required: true },
  price: { type: Number, required: true },
  classLink: { type: String, required: true },
  image: { type: String, required: true }, // Image field for class (Cloudinary URL)
  difficultyLevel: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  students: [studentSchema], // list of students
});

// Instructor schema
const instructorSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  experience: { type: Number, required: true },
  qualifications: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  classes: [classSchema], // list of classes
});

const Instructor = model("Instructor", instructorSchema);

export default Instructor;

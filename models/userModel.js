import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
  role: { type: String, default: "user" },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dp4gvijd6/image/upload/v1741167612/profile_ucyhch.png",
  },
  experience: { type: Number, default: 0 },
  phone: { type: String, default: "" },
  qualifications: { type: String, default: "" },
  bio: { type: String, default: "" },

  favoriteClasses: [
    {
      classId: { type: mongoose.Schema.Types.ObjectId },
    },
  ],

  enrolledClasses: [
    {
      classId: { type: mongoose.Schema.Types.ObjectId },
    },
  ],
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

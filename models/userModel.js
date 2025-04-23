import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["user", "instructor", "admin"],
      default: "user",
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dp4gvijd6/image/upload/v1741167612/profile_ucyhch.png",
    },
    experience: { type: Number, default: 0 },
    phone: { type: String, default: "" },
    qualifications: { type: String, default: "" },
    address: { type: String, default: "" },
    bio: { type: String, default: "" },
    favoriteClasses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    enrolledClasses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    cartItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "YogaAccessory",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    banInfo: {
      isBanned: { type: Boolean, default: false },
      banReason: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

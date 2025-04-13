import mongoose from "mongoose";

const YogaAccessorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Mat", "Block", "Strap", "Bolster", "Towel", "Clothing", "Other"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    images: [
      {
        type: String, // Store image URLs
        required: true,
      },
    ],
    brand: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const YogaAccessory = mongoose.model("YogaAccessory", YogaAccessorySchema);

export default YogaAccessory;

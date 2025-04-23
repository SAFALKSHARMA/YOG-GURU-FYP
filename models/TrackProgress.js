import { Schema, model } from "mongoose";

const trackProgressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    className: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    classDate: {
      type: Date,
      required: true,
    },
    learnedToday: {
      type: String,
      trim: true,
    },
    todaysPlan: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model("TrackProgress", trackProgressSchema);

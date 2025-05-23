// Schema for storing blog contents\

import mongoose from "mongoose";
const { Schema } = mongoose;
// Blog schema
const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);
// Export the model
export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);

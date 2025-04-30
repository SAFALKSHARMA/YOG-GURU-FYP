import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
      index: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [100, "Content should be at least 100 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    tags: [String],
    featuredImage: String,
    readTime: Number, // in minutes
    seoKeywords: [String],
    slug: String,
  },
  { timestamps: true }
);

// Generate slug before saving
blogPostSchema.pre("save", function (next) {
  this.slug = this.title.toLowerCase().split(" ").join("-");
  next();
});

export const BlogPost = mongoose.model("BlogPost", blogPostSchema);

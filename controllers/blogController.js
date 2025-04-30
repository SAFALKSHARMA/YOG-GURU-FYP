import { BlogPost } from "../models/blogPost.js";

// Create new blog post
export const createPost = async (req, res) => {
  try {
    const { title, content, tags, featuredImage } = req.body;

    const post = await BlogPost.create({
      title,
      content,
      author: req.user.id,
      tags,
      featuredImage,
      readTime: Math.ceil(content.split(" ").length / 200), // 200 WPM reading speed
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all posts (with filtering)
export const getPosts = async (req, res) => {
  try {
    const { status, tag, author } = req.query;
    const query = {};

    if (status) query.status = status;
    if (tag) query.tags = tag;
    if (author) query.author = author;

    const posts = await BlogPost.find(query)
      .populate("author", "name email")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update post status (draft/published/archived)
export const updatePostStatus = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Add to reading list (like cart functionality)
export const addToReadingList = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { readingList: req.params.postId } },
      { new: true }
    ).populate("readingList");

    res.status(200).json({
      success: true,
      data: user.readingList,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

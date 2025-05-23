import blog from "../models/blog.js";

// Function to create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const newBlog = new blog({ title, content, image });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "Error creating blog post", error });
  }
};

// Function to get all blog posts
export const getBlogs = async (req, res) => {
  try {
    const blogs = await blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog posts", error });
  }
};

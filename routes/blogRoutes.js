import { createBlog, getBlogs } from "../controllers/blogController.js";
import express from "express";

const router = express.Router();
// Route to create a new blog post
router.post("/create", createBlog);
// Route to get all blog posts
router.get("/", getBlogs);
// Export the router
export default router;

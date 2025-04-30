import express from "express";
import {
  createPost,
  getPosts,
  updatePostStatus,
  addToReadingList,
} from "../controllers/blogController.js";
import { protect, checkOwnership } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createPost).get(getPosts);

router
  .route("/:id/status")
  .patch(protect, checkOwnership(BlogPost), updatePostStatus);

router.route("/reading-list/:postId").post(protect, addToReadingList);

export default router;

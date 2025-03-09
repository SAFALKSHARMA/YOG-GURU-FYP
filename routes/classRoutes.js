import express from "express";
import { createClass } from "../controllers/classController.js";

const router = express.Router();

// Route to create a class
router.post("/create", createClass);

export default router;

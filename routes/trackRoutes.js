import express from "express";
import {
  createProgressEntry,
  deleteProgressEntry,
  getUserProgressEntries,
} from "../controllers/trackController.js";

const router = express.Router();

router.post("/create-progress", createProgressEntry);
router.get("/get-progress", getUserProgressEntries);
router.delete("/delete-progress/:id", deleteProgressEntry);

export default router;

import express from "express";
import {
  createYogaAccessory,
  getAllYogaAccessories,
} from "../controllers/shopController.js";

const router = express.Router();

// Route to create a new yoga accessory
router.post("/add-items", createYogaAccessory);
router.get("/getAll-items", getAllYogaAccessories);

export default router;

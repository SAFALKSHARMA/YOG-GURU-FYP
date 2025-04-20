import express from "express";
import {
  createYogaAccessory,
  getAllYogaAccessories,
  getYogaAccessoryById,
  addToCart,
  getCartItems,
  removeFromCart,
} from "../controllers/shopController.js";

const router = express.Router();

// Route to create a new yoga accessory
router.post("/add-items", createYogaAccessory);
router.get("/getAll-items", getAllYogaAccessories);
router.get("/get-item/:id", getYogaAccessoryById);
router.post("/add-to-cart", addToCart);
router.delete("/cart/:userId/items/:productId", removeFromCart);
router.get("/cart/:userId", getCartItems);

export default router;

import express from "express";
import {
  initiatePayment,
  initiateCartPayment,
  verifyPayment,
  checkPaymentStatus,
  getUserOrders,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/initiate", initiatePayment); // For class payments
router.post("/initiate-cart", initiateCartPayment); // For cart payments
router.post("/verify", verifyPayment); // Verify payments
router.get("/check", checkPaymentStatus); // Check payment status
router.get("/orders/:userId", getUserOrders);

export default router;

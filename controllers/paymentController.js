import ClassPayment from "../models/ClassPayment.model.js";
import Class from "../models/class.model.js";
import User from "../models/userModel.js";
import axios from "axios";

const khalti = axios.create({
  baseURL: "https://a.khalti.com/api/v2/",
  headers: {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// Initiate payment for a class (unchanged)
export const initiatePayment = async (req, res) => {
  try {
    const { classId, userId } = req.body;

    console.log("[Payment Initiation] Request received:", {
      body: req.body,
      extractedData: { classId, userId },
    });

    if (!classId || !userId) {
      console.error("[Validation Error] Missing required fields:", {
        classIdPresent: !!classId,
        userIdPresent: !!userId,
      });
      return res.status(400).json({
        success: false,
        message: "Both classId and userId are required",
      });
    }

    console.log(`[Database Query] Looking up class: ${classId}`);
    const classData = await Class.findById(classId);
    if (!classData) {
      console.error(`[Not Found] Class not found with ID: ${classId}`);
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    if (classData.capacity <= 0) {
      console.error(`[Business Rule] Class is full: ${classId}`);
      return res.status(400).json({
        success: false,
        message: "Class is full",
      });
    }

    console.log(`[Database Query] Looking up user: ${userId}`);
    const user = await User.findById(userId);
    if (!user) {
      console.error(`[Not Found] User not found with ID: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(
      `[Database Query] Checking for existing payment for user ${userId} and class ${classId}`
    );
    const existingPayment = await ClassPayment.findOne({ userId, classId });
    if (existingPayment && existingPayment.paymentStatus === "paid") {
      console.error(
        "[Business Rule] Payment already exists and is paid:",
        existingPayment
      );
      return res.status(400).json({
        success: false,
        message: "This class has already been paid for",
      });
    }

    const payment =
      existingPayment ||
      new ClassPayment({
        userId,
        classId,
        totalPrice: classData.price,
        paymentStatus: "pending",
        paymentMethod: "khalti",
      });

    console.log("[Payment Record] Saving payment:", payment);
    await payment.save();

    const payload = {
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
      website_url: process.env.FRONTEND_URL,
      amount: classData.price * 100, // Khalti expects amount in paisa
      purchase_order_id: payment._id.toString(),
      purchase_order_name: `Class: ${classData.className}`,
      customer_info: {
        name: user.name || "Customer",
        email: user.email || "no-reply@example.com",
        phone: user.phone || "9800000000",
      },
    };

    console.log("[Khalti Request] Initiating payment with payload:", payload);
    const response = await khalti.post("epayment/initiate/", payload);

    payment.pidx = response.data.pidx;
    console.log("[Payment Record] Updating with pidx:", response.data.pidx);
    await payment.save();

    console.log("[Success] Payment initiated successfully");
    res.status(200).json({
      success: true,
      paymentUrl: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (error) {
    console.error("[Payment Error]", {
      error: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: error.message,
      khaltiError: error.response?.data,
    });
  }
};

// Initiate payment for cart
export const initiateCartPayment = async (req, res) => {
  try {
    const { userId, totalAmount, cartItems, promoCode } = req.body;

    console.log("[Cart Payment Initiation] Request received:", {
      userId,
      totalAmount,
      cartItems,
      promoCode,
    });

    if (!userId || !totalAmount || !cartItems || !Array.isArray(cartItems)) {
      console.error("[Validation Error] Missing required fields:", {
        userIdPresent: !!userId,
        totalAmountPresent: !!totalAmount,
        cartItemsPresent: !!cartItems,
      });
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await User.findById(userId).populate("cartItems.product");
    if (!user) {
      console.error(`[Not Found] User not found with ID: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.cartItems || user.cartItems.length === 0) {
      console.error("[Not Found] Cart is empty for user:", userId);
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Calculate subtotal
    const subtotal = user.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Calculate tax (8%)
    const tax = subtotal * 0.08;

    // Calculate shipping (free if subtotal > 100, else $5.99)
    const shipping = subtotal > 100 ? 0 : 5.99;

    // Calculate discount (10% if promo code is "yogaguru")
    let discount = 0;
    if (promoCode && promoCode.toLowerCase() === "yogaguru") {
      discount = subtotal * 0.1;
    } else if (promoCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid promo code",
      });
    }

    // Calculate total
    const calculatedTotal = subtotal + tax + shipping - discount;

    // Validate totalAmount
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      console.error("[Validation Error] Total amount mismatch:", {
        calculatedTotal,
        providedTotal: totalAmount,
      });
      return res.status(400).json({
        success: false,
        message: "Total amount mismatch",
      });
    }

    // Validate stock
    for (const item of user.cartItems) {
      if (item.quantity > item.product.stock) {
        console.error("[Validation Error] Insufficient stock for product:", {
          productId: item.product._id,
          requestedQuantity: item.quantity,
          availableStock: item.product.stock,
        });
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }

    const payment = new ClassPayment({
      userId,
      cartItems: cartItems.map((item) => ({
        cartItemId: item.cartItemId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: totalAmount,
      paymentStatus: "pending",
      paymentMethod: "khalti",
    });

    console.log("[Payment Record] Saving cart payment:", payment);
    await payment.save();

    const payload = {
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
      website_url: process.env.FRONTEND_URL,
      amount: totalAmount * 100, // Convert to paisa
      purchase_order_id: payment._id.toString(),
      purchase_order_name: `Cart Purchase`,
      customer_info: {
        name: user.name || "Customer",
        email: user.email || "no-reply@example.com",
        phone: user.phone || "9800000000",
      },
    };

    console.log(
      "[Khalti Request] Initiating cart payment with payload:",
      payload
    );
    const response = await khalti.post("epayment/initiate/", payload);

    payment.pidx = response.data.pidx;
    console.log("[Payment Record] Updating with pidx:", response.data.pidx);
    await payment.save();

    console.log("[Success] Cart payment initiated successfully");
    res.status(200).json({
      success: true,
      paymentUrl: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (error) {
    console.error("[Cart Payment Error]", {
      error: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    res.status(500).json({
      success: false,
      message: "Cart payment initiation failed",
      error: error.message,
      khaltiError: error.response?.data,
    });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { pidx, purchase_order_id } = req.body;

    console.log("[Payment Verification] Request received:", {
      pidx,
      purchase_order_id,
    });

    const payment = await ClassPayment.findOne({
      _id: purchase_order_id,
      pidx,
    });

    if (!payment) {
      console.error("[Not Found] Payment record not found:", {
        pidx,
        purchase_order_id,
      });
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    console.log("[Khalti Request] Verifying payment with pidx:", pidx);
    const response = await khalti.post("epayment/lookup/", { pidx });

    if (response.data.status !== "Completed") {
      console.error("[Payment Failed] Khalti status not completed:", {
        status: response.data.status,
      });
      payment.paymentStatus = "failed";
      await payment.save();
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    payment.paymentStatus = "paid";
    payment.paymentDate = new Date();
    payment.transactionId = response.data.transaction_id;
    await payment.save();

    if (payment.classId) {
      // Handle class enrollment
      console.log("[Enrollment] Triggering enrollment for:", {
        userId: payment.userId,
        classId: payment.classId,
      });

      const enrollResponse = await axios.post(
        `${process.env.BACKEND_URL}/api/classes/enroll`,
        {
          userId: payment.userId,
          classId: payment.classId,
        }
      );

      if (!enrollResponse.data.success) {
        throw new Error("Failed to enroll after payment");
      }

      console.log("[Success] Khalti payment verified and enrollment completed");
      res.status(200).json({
        success: true,
        classId: payment.classId,
      });
    } else if (payment.cartItems && payment.cartItems.length > 0) {
      // Clear cart
      await User.findByIdAndUpdate(payment.userId, { $set: { cartItems: [] } });

      // Optional: Create an order record (uncomment if needed)
      /*
      const order = new Order({
        userId: payment.userId,
        items: payment.cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: payment.totalPrice,
        paymentStatus: "paid",
        paymentId: payment._id,
      });
      await order.save();
      */

      console.log("[Success] Khalti payment verified and cart cleared");
      res.status(200).json({
        success: true,
        message: "Cart payment verified",
      });
    } else {
      throw new Error("Invalid payment type");
    }
  } catch (error) {
    console.error("[Verification Error]", {
      error: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    res.status(500).json({
      success: false,
      message: error.message,
      details: error.response?.data || null,
    });
  }
};

// Check payment status (unchanged)
export const checkPaymentStatus = async (req, res) => {
  try {
    const { classId, userId } = req.query;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Class ID and User ID are required" });
    }
    const payment = await ClassPayment.findOne({ classId, userId });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      console.error("[Validation Error] Missing userId");
      return res.status(400).json({
        success: false,
        message: "Missing userId",
      });
    }

    const orders = await ClassPayment.find({
      userId,
      paymentStatus: "paid",
      cartItems: { $exists: true, $ne: [] },
    })
      .populate("cartItems.productId")
      .sort({ paymentDate: -1 });

    console.log(
      `[Success] Fetched ${orders.length} orders for user: ${userId}`
    );

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("[Order Fetch Error]", {
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch order history",
      error: error.message,
    });
  }
};

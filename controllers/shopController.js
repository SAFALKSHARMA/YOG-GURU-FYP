import YogaAccessory from "../models/shop.js";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";

export const createYogaAccessory = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      stock,
      images,
      brand,
      color,
      material,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !description ||
      !category ||
      !price ||
      !stock ||
      !images ||
      images.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create new yoga accessory
    const newAccessory = new YogaAccessory({
      name,
      description,
      category,
      price,
      stock,
      images,
      brand,
      color,
      material,
    });

    // Save to database
    const savedAccessory = await newAccessory.save();

    res.status(201).json({
      success: true,
      message: "Yoga accessory created successfully",
      data: savedAccessory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getAllYogaAccessories = async (req, res) => {
  try {
    const accessories = await YogaAccessory.find();

    res.status(200).json({
      success: true,
      message: "Yoga accessories fetched successfully",
      data: accessories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getYogaAccessoryById = async (req, res) => {
  try {
    // Check if the ID is valid
    console.log(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const accessory = await YogaAccessory.findById(req.params.id);

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: accessory,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Validate input
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId, productId, and quantity",
      });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if product exists
    const product = await YogaAccessory.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is already in cart
    const existingItemIndex = user.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists in cart
      user.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cartItems.push({
        product: productId,
        quantity: quantity,
      });
    }

    // Save the updated user
    await user.save();

    // Populate product details in the response
    const populatedUser = await userModel
      .findById(userId)
      .populate("cartItems.product");

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart: populatedUser.cartItems,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCartItems = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId).populate("cartItems.product");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Calculate the total count of items in the cart
    const totalCount = user.cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    res.status(200).json({
      success: true,
      cartItems: user.cartItems,
      count: totalCount,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching cart items",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Validate input
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId and productId",
      });
    }

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if product exists in user's cart
    const itemIndex = user.cartItems.findIndex(
      (item) => item._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Remove the item from cart
    user.cartItems.splice(itemIndex, 1);

    // Save the updated user
    await user.save();

    // Populate product details in the response
    const populatedUser = await userModel
      .findById(userId)
      .populate("cartItems.product");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart: populatedUser.cartItems,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

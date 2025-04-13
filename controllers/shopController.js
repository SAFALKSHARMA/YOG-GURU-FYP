import YogaAccessory from "../models/shop.js";

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

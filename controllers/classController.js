import Instructor from "../models/Instructor.js";

export const createClass = async (req, res) => {
  try {
    const {
      instructorId,
      className,
      description,
      date,
      time,
      duration,
      capacity,
      totalDuration,
      price,
      classLink,
      image, // Make sure this is passed from the request body
      difficultyLevel,
    } = req.body;

    // Ensure required fields are provided
    if (!instructorId || !className || !date || !time || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields." });
    }

    // Find the instructor in the database
    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor not found." });
    }

    // Create the new class object
    const newClass = {
      className,
      description,
      date,
      time,
      duration,
      capacity,
      totalDuration,
      price,
      classLink,
      image, // Cloudinary image URL
      difficultyLevel,
      students: [], // Default empty student list
    };

    // Add the class to the instructor's `classes` array
    instructor.classes.push(newClass);

    // Save the updated instructor document
    await instructor.save();

    res.status(201).json({
      success: true,
      message: "Class added successfully!",
      class: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

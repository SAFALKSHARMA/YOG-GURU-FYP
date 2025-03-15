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

// Controller to fetch all classes of all instructors with 'Approved' status
export const getAllClasses = async (req, res) => {
  try {
    // Fetch instructors and their classes
    const instructors = await Instructor.find({}, "classes");

    // Filter the classes to only include those with 'Approved' status
    const allClasses = instructors
      .flatMap((instructor) => instructor.classes)
      .filter((classItem) => classItem.status === "Approved");

    res.status(200).json(allClasses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching classes", error: error.message });
  }
};

// Controller function to update class status
// Function to update class status
export const updateClassStatus = async (req, res) => {
  const { classId, newStatus } = req.body;

  try {
    const instructor = await Instructor.findOne({
      "classes._id": classId, // Find the instructor with the class
    });

    if (!instructor) {
      return res.status(404).json({ message: "Instructor or class not found" });
    }

    // Find the class to update
    const classToUpdate = instructor.classes.find(
      (classItem) => classItem._id.toString() === classId
    );

    if (!classToUpdate) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Update the class status
    classToUpdate.status = newStatus;

    // Save the updated instructor
    await instructor.save();

    res.status(200).json({ message: "Class status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

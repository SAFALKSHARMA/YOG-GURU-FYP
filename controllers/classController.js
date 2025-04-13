import Instructor from "../models/Instructor.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

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

// Fetch class details by classId
export const getClassDetails = async (req, res) => {
  try {
    const { classId } = req.params;

    // Find an instructor that has the class
    const instructor = await Instructor.findOne({ "classes._id": classId });

    if (!instructor) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find the specific class by ID
    const classDetails = instructor.classes.id(classId);

    if (!classDetails) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Include instructor's full name
    const response = {
      ...classDetails.toObject(),
      instructorFullName: instructor.fullName,
      instructorId: instructor._id,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { userId, classId } = req.body;

    if (!userId || !classId) {
      return res
        .status(400)
        .json({ message: "User ID and Class ID are required" });
    }

    // Find the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if class is already in favorites
    const isFavorite = user.favoriteClasses.some(
      (fav) => fav.classId.toString() === classId
    );

    if (isFavorite) {
      // Remove from favorites
      user.favoriteClasses = user.favoriteClasses.filter(
        (fav) => fav.classId.toString() !== classId
      );
    } else {
      // Add to favorites
      user.favoriteClasses.push({ classId });
    }

    await user.save();

    res.json({
      isFavorite: !isFavorite,
      message: isFavorite ? "Removed from favorites" : "Added to favorites",
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFavoriteClasses = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Extract and return only class IDs
    const favoriteClassIds = user.favoriteClasses.map((fav) => fav.classId);

    res.json({ success: true, favoriteClassIds });
  } catch (error) {
    console.error("Error fetching favorite class IDs:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const enrollUserInClass = async (req, res) => {
  const { userId, classId, instructorId, email, image, fullName } = req.body;

  if (!userId || !classId || !instructorId || !email || !fullName) {
    return res.status(400).json({
      message:
        "User ID, Class ID, Instructor ID, Email, and Full Name are required",
    });
  }

  try {
    // Find the instructor by instructorId
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Find the specific class in the instructor's classes
    const classToEnroll = instructor.classes.find(
      (cls) => cls._id.toString() === classId
    );
    if (!classToEnroll) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if class has available capacity
    if (classToEnroll.capacity <= 0) {
      return res.status(400).json({ message: "Class is already full" });
    }

    // Check if user is already in the class's students list by email
    const isAlreadyInClass = classToEnroll.students.some(
      (student) => student.email === email
    );
    if (isAlreadyInClass) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this class" });
    }

    // Add user to the class's students list
    classToEnroll.students.push({
      fullName,
      email,
      image: image || "",
      enrolledDate: new Date(),
    });

    // Decrease the class capacity by 1
    classToEnroll.capacity -= 1;

    // Find and update user (if you still want to track enrollments in user document)
    const user = await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledClasses: { classId } } },
      { new: true }
    );

    // Save the instructor document
    await instructor.save();

    // Respond with success
    res.status(200).json({
      message: "Successfully enrolled in the class",
      remainingCapacity: classToEnroll.capacity,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while enrolling the user" });
  }
};

export const getEnrolledClasses = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Find the user by userId and only return the enrolledClasses field
    const user = await userModel.findById(userId, "enrolledClasses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract only classIds from enrolledClasses
    const classIds = user.enrolledClasses.map(
      (enrolledClass) => enrolledClass.classId
    );

    // Respond with classIds as an array
    res.status(200).json(classIds); // Returning an array of classIds
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching enrolled classes" });
  }
};

export const updateClass = async (req, res) => {
  const { _id } = req.params; // Class _id from URL
  const {
    className,
    description,
    date,
    time,
    duration,
    capacity,
    totalDuration,
    price,
    classLink,
    difficultyLevel,
    status,
    students,
    instructorId,
  } = req.body; // Data from the request body

  try {
    let imageUrl = null;

    // Check if an image was uploaded by multer
    if (req.file) {
      imageUrl = req.file.path; // Multer + Cloudinary gives you the URL here
      console.log("Image uploaded successfully:", imageUrl);
    }

    // Find the instructor by instructorId
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Find the class in the instructor's classes list using _id
    const classToUpdate = instructor.classes.id(_id);
    if (!classToUpdate) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Update the class properties
    classToUpdate.className = className || classToUpdate.className;
    classToUpdate.description = description || classToUpdate.description;
    classToUpdate.date = date || classToUpdate.date;
    classToUpdate.time = time || classToUpdate.time;
    classToUpdate.duration = duration || classToUpdate.duration;
    classToUpdate.capacity = capacity || classToUpdate.capacity;
    classToUpdate.totalDuration = totalDuration || classToUpdate.totalDuration;
    classToUpdate.price = price || classToUpdate.price;
    classToUpdate.classLink = classLink || classToUpdate.classLink;
    classToUpdate.difficultyLevel =
      difficultyLevel || classToUpdate.difficultyLevel;
    classToUpdate.status = status || classToUpdate.status;

    // Update image if uploaded
    if (imageUrl) {
      classToUpdate.image = imageUrl;
    }

    // Optional: Update students list if you need
    // classToUpdate.students = students || classToUpdate.students;

    // Save the updated instructor document
    await instructor.save();

    res.status(200).json({
      message: "Class updated successfully",
      updatedClass: classToUpdate,
    });
  } catch (err) {
    console.error("Error updating class:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { instructorId, classId } = req.body;

    if (!instructorId || !classId) {
      return res
        .status(400)
        .json({ message: "Instructor Id or class Id is empty" });
    }

    // Find the instructor
    const instructor = await Instructor.findById(instructorId);
    if (!instructorId) {
      return res.status(400).json({ message: "Instructor not found" });
    }

    // Remove the class from the instructor's classes array
    instructor.classes = instructor.classes.filter(
      (cls) => cls._id.toString() !== classId
    );

    await instructor.save();
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

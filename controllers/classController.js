import Instructor from "../models/Instructor.js";
import userModel from "../models/userModel.js";
import Class from "../models/class.model.js";
import mongoose from "mongoose";
import studentModel from "../models/student.model.js";
import { sendEnrollmentEmail } from "../utils/emailTemplates.js";
import Student from "../models/student.model.js";
import { sendWhatsAppMessage } from "../utils/sendWhatsappMsg.js";

export const createClass = async (req, res) => {
  try {
    const {
      instructorId,
      className,
      description,
      category,
      date,
      time,
      duration,
      capacity,
      totalDuration,
      price,
      classLink,
      location,
      difficultyLevel,
      image,
    } = req.body;

    // Validate required fields
    if (!instructorId || !className || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Instructor ID, class name, date, and time are required.",
      });
    }

    // Check if instructor exists
    const instructor = await Instructor.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found.",
      });
    }

    // Create new class
    const newClass = new Class({
      className,
      description,
      category,
      date,
      time,
      duration,
      capacity,
      totalDuration,
      price,
      classLink,
      location,
      image,
      difficultyLevel,
      instructor: instructor._id,
      status: "Pending", // Default status
    });

    await newClass.save();

    // Add class reference to instructor
    instructor.classes.push(newClass._id);
    await instructor.save();

    res.status(201).json({
      success: true,
      message: "Class created successfully!",
      class: newClass,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find({ status: "Approved" }).populate(
      "instructor",
      "fullName image"
    );
    // .populate("students", "fullName email image");

    res.status(200).json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching classes",
      error: error.message,
    });
  }
};

export const getAllClassApplications = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate({
        path: "instructor",
        select:
          "fullName email phone experience qualifications bio image serviceTypes",
      })
      // .populate({
      //   path: "students",
      //   select: "fullName email image enrolledDate",
      // })
      .sort({ createdAt: -1 }); // Sort by newest first

    if (!classes || classes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No class applications found",
      });
    }

    res.status(200).json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    console.error("Error fetching class applications:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateClassStatus = async (req, res) => {
  try {
    const { classId, newStatus } = req.body;

    console.log("Received Payload:", { classId, newStatus });

    if (!classId || !newStatus) {
      return res.status(400).json({
        success: false,
        message: "Class ID and new status are required.",
      });
    }

    // First, update the class status
    const updatedClass = await Class.findByIdAndUpdate(
      classId,
      { status: newStatus },
      { new: true }
    ).populate("instructor", "phone"); // only get the phone field

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    const instructorPhone = updatedClass.instructor?.phone;

    console.log(instructorPhone);

    // Send WhatsApp message to instructor
    if (instructorPhone) {
      const message = `Your class "${updatedClass.className}" status has been updated to "${newStatus}".`;
      await sendWhatsAppMessage(instructorPhone, message);
    } else {
      console.warn("Instructor phone number not available.");
    }

    res.status(200).json({
      success: true,
      message: "Class status updated successfully.",
      class: updatedClass,
      instructorPhone: instructorPhone || "Phone not available",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating class status",
      error: error.message,
    });
  }
};

export const getClassDetails = async (req, res) => {
  try {
    const { classId } = req.params;

    const classDetails = await Class.findById(classId).populate(
      "instructor",
      "fullName email image bio"
    );
    // .populate("students", "fullName email image enrolledDate");

    if (!classDetails) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    res.status(200).json({
      success: true,
      class: classDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching class details",
      error: error.message,
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { userId, classId } = req.body;
    console.log("Received Payload:", { userId, classId });

    if (!userId || !classId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Class ID are required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(classId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID or Class ID format.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const classExists = await Class.exists({ _id: classId });
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    // Check if the class is already favorited
    const favoriteIndex = user.favoriteClasses.findIndex((favId) =>
      favId.equals(classId)
    );

    let message, isFavorite;
    if (favoriteIndex === -1) {
      // Add to favorites
      user.favoriteClasses.push(new mongoose.Types.ObjectId(classId));
      message = "Added to favorites.";
      isFavorite = true;
    } else {
      // Remove from favorites
      user.favoriteClasses.splice(favoriteIndex, 1);
      message = "Removed from favorites.";
      isFavorite = false;
    }

    await user.save();

    res.status(200).json({
      success: true,
      isFavorite,
      message,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling favorite",
      error: error.message,
    });
  }
};

export const getFavoriteClasses = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).populate({
      path: "favoriteClasses",
      select:
        "className image instructor date time difficultyLevel price totalDuration capacity",
      populate: {
        path: "instructor",
        select: "fullName",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      favoriteClasses: user.favoriteClasses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching favorite classes",
      error: error.message,
    });
  }
};

// Enroll user in class
export const enrollUserInClass = async (req, res) => {
  try {
    const { userId, classId, instructorId } = req.body;

    if (!userId || !classId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Class ID are required.",
      });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find class with instructor populated
    const classToEnroll = await Class.findById(classId).populate("instructor");
    if (!classToEnroll) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    // Check capacity
    if (classToEnroll.capacity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Class is already full.",
      });
    }

    // Check if already enrolled
    const isAlreadyEnrolled = classToEnroll.students.includes(userId);
    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this class.",
      });
    }

    // Add student to class
    classToEnroll.students.push(userId);
    classToEnroll.capacity -= 1;
    await classToEnroll.save();

    // Add class to user's enrolled classes
    if (!user.enrolledClasses.includes(classId)) {
      user.enrolledClasses.push(classId);
      await user.save();
    }

    const students = new studentModel({
      user: userId,
      classId: classId,
      instructorId: classToEnroll.instructor._id, // Use the class's instructor
    });

    await students.save();

    // Send enrollment emails
    await sendEnrollmentEmail(user, classToEnroll.instructor, classToEnroll);

    // Send WhatsApp message to instructor and user
    const messageToInstructor = `A new student has enrolled in your class "${classToEnroll.className}".`;
    await sendWhatsAppMessage(
      classToEnroll.instructor.phone,
      messageToInstructor
    );
    const messageToUser = `You have successfully enrolled in the class "${classToEnroll.className}".`;
    await sendWhatsAppMessage(user.phone, messageToUser);

    res.status(200).json({
      success: true,
      message: "Successfully enrolled in the class.",
      remainingCapacity: classToEnroll.capacity,
    });
  } catch (error) {
    console.error("Error enrolling in class:", error);
    res.status(500).json({
      success: false,
      message: "Error enrolling in class",
      error: error.message,
    });
  }
};

export const getEnrolledClasses = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).populate({
      path: "enrolledClasses",
      select:
        "className image instructor date time difficultyLevel price totalDuration capacity",
      populate: {
        path: "instructor",
        select: "fullName",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      enrolledClasses: user.enrolledClasses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching enrolled classes",
      error: error.message,
    });
  }
};

export const updateClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Create updateData manually since req.body is not available with FormData directly
    const updateData = { ...req.body };

    // Multer handles image uploads
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedClass = await Class.findByIdAndUpdate(classId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully.",
      class: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating class",
      error: error.message,
    });
  }
};

export const deleteClass = async (req, res) => {
  try {
    const { classId, instructorId } = req.body;

    if (!classId || !instructorId) {
      return res.status(400).json({
        success: false,
        message: "Class ID and Instructor ID are required.",
      });
    }

    // Verify instructor owns the class
    const classToDelete = await Class.findOne({
      _id: classId,
      instructor: instructorId,
    });

    if (!classToDelete) {
      return res.status(404).json({
        success: false,
        message: "Class not found.",
      });
    }

    // Remove class from instructor's classes array
    await Instructor.findByIdAndUpdate(instructorId, {
      $pull: { classes: classId },
    });

    // Delete all students enrolled in this class
    await Student.deleteMany({ classId });

    // Delete the class
    await Class.findByIdAndDelete(classId);

    res.status(200).json({
      success: true,
      message: "Class and associated students deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting class",
      error: error.message,
    });
  }
};

export const getInstructorClasses = async (req, res) => {
  try {
    const { instructorId } = req.params;

    console.log("Instructor QID received:", instructorId);

    if (!instructorId) {
      return res.status(400).json({ message: "Instructor ID is required." });
    }

    const classes = await Class.find({ instructor: instructorId }).populate(
      "students"
    );

    res.status(200).json({ classes });
  } catch (error) {
    console.error("Error fetching instructor classes:", error);
    res.status(500).json({ message: "Server error while fetching classes." });
  }
};

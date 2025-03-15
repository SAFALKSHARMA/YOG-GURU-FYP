import InstructorApplication from "../models/InstructorApplication.js";
import userModel from "../models/userModel.js";
import Instructor from "../models/Instructor.js";

// Submit a new instructor application
export const submitApplication = async (req, res) => {
  try {
    const { fullName, email, phone, experience, qualifications, bio, image } =
      req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !experience ||
      !qualifications ||
      !bio ||
      !image
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingApplication = await InstructorApplication.findOne({ email });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "Application with this email already exists" });
    }

    const newApplication = new InstructorApplication({
      fullName,
      email,
      phone,
      experience,
      qualifications,
      bio,
      image, // Save the image URL in the database
    });

    await newApplication.save();
    res.status(201).json({
      message: "Application submitted successfully",
      data: newApplication,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting application", error: error.message });
  }
};

// Get all applications (for admin)
export const getApplications = async (req, res) => {
  try {
    const applications = await InstructorApplication.find();
    res.status(200).json(applications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching applications", error: error.message });
  }
};

// Approve instructor
export const approveInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // Find instructor application
    const instructorApplication = await InstructorApplication.findById(
      instructorId
    );
    if (!instructorApplication) {
      return res
        .status(404)
        .json({ message: "Instructor application not found" });
    }

    // Log the instructor application data
    console.log("Instructor Application:", instructorApplication);

    // Update user role to "instructor" only
    const updatedUser = await userModel.findOneAndUpdate(
      { email: instructorApplication.email }, // Find by email
      { $set: { role: "instructor", image: instructorApplication.image } }, // Only update the role
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    // Log the updated user data
    console.log("Updated User:", updatedUser);

    // Ensure all required fields are provided before saving the Instructor
    if (
      !instructorApplication.fullName ||
      !instructorApplication.email ||
      !instructorApplication.image
    ) {
      return res.status(400).json({
        message: "Missing required fields in the instructor application",
      });
    }

    // Save instructor data in the Instructor schema
    const newInstructor = new Instructor({
      fullName: instructorApplication.fullName,
      email: instructorApplication.email,
      phone: instructorApplication.phone,
      experience: instructorApplication.experience,
      qualifications: instructorApplication.qualifications,
      bio: instructorApplication.bio,
      image: instructorApplication.image,
      classes: [], // Initially, no classes
    });

    // Save the new instructor to the database
    await newInstructor.save();

    // Update instructor application status to "Approved"
    await InstructorApplication.findByIdAndUpdate(instructorId, {
      status: "Approved",
    });

    res.status(200).json({
      message: "Instructor approved and data saved successfully!",
      user: updatedUser,
      instructor: newInstructor,
    });
  } catch (error) {
    console.error("Error approving instructor:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Reject instructor
export const rejectInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // Find the instructor application
    const instructorApplication = await InstructorApplication.findById(
      instructorId
    );
    if (!instructorApplication) {
      return res
        .status(404)
        .json({ message: "Instructor application not found" });
    }

    // Update the user's role back to "user" (only role, no additional fields)
    const updatedUser = await userModel.findOneAndUpdate(
      { email: instructorApplication.email },
      { $set: { role: "user" } }, // Only revert the role to "user"
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the instructor from the Instructor model
    await Instructor.findOneAndDelete({ email: instructorApplication.email });

    // Update the instructor application status to "rejected"
    instructorApplication.status = "Rejected";
    await instructorApplication.save();

    res.status(200).json({
      message: "Instructor rejected and removed successfully!",
      user: updatedUser,
      instructor: instructorApplication,
    });
  } catch (error) {
    console.error("Error rejecting instructor:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find({}); // Fetch all instructors including their classes
    res.status(200).json(instructors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching instructors", error: error.message });
  }
};

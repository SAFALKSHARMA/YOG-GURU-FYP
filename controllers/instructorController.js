import InstructorApplication from "../models/InstructorApplication.js";
import userModel from "../models/userModel.js";
import Instructor from "../models/Instructor.js";

export const submitApplication = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      experience,
      qualifications,
      bio,
      serviceType,
    } = req.body;

    // Check if application with this email already exists
    const existingApplication = await InstructorApplication.findOne({ email });
    if (existingApplication) {
      return res.status(409).json({
        message: "Application with this email already exists",
      });
    }

    // Validate required fields
    const requiredFields = {
      fullName,
      email,
      phone,
      experience,
      qualifications,
      bio,
      serviceType,
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return res.status(400).json({
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`,
        });
      }
    }

    // Validate file uploads
    if (!req.files?.image || req.files.image.length === 0) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    if (!req.files?.documents || req.files.documents.length === 0) {
      return res.status(400).json({
        message: "At least one document is required",
      });
    }

    if (!req.files?.certificates || req.files.certificates.length === 0) {
      return res.status(400).json({
        message: "At least one certificate is required",
      });
    }

    // Extract URLs directly from multer (already uploaded to Cloudinary)
    const imageUrl = req.files.image[0].path;
    const documents = req.files.documents.map((file) => file.path);
    const certificates = req.files.certificates.map((file) => file.path);

    // Create new application
    const newApplication = new InstructorApplication({
      fullName,
      email,
      phone,
      experience,
      qualifications,
      bio,
      serviceType,
      image: imageUrl,
      documents,
      certificates,
    });

    await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully!",
      application: {
        id: newApplication._id,
        fullName: newApplication.fullName,
        email: newApplication.email,
        status: newApplication.status,
      },
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      message: "Something went wrong, please try again.",
    });
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

    console.log("Instructor Application:", instructorApplication);

    // Update user role to "instructor"
    const updatedUser = await userModel.findOneAndUpdate(
      { email: instructorApplication.email }, // Find by email
      {
        $set: {
          role: "instructor",
          image: instructorApplication.image,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    console.log("Updated User:", updatedUser);

    // Validate all required fields
    if (
      !instructorApplication.fullName ||
      !instructorApplication.email ||
      !instructorApplication.image ||
      !instructorApplication.serviceType
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
      serviceTypes: instructorApplication.serviceType, // Add service types
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

// Controller function to get an instructor by ID
export const getInstructorById = async (req, res) => {
  const { instructorId } = req.params;

  try {
    // Find the instructor by their unique ID
    const instructor = await Instructor.findById(instructorId);

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Send the instructor data back in the response
    res.status(200).json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

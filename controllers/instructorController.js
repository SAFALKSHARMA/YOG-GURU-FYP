import InstructorApplication from "../models/InstructorApplication.js";
import User from "../models/userModel.js";
import Instructor from "../models/Instructor.js";
import { sendWhatsAppMessage } from "../utils/sendWhatsappMsg.js";

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
      userId, // Added userId from the authenticated user
    } = req.body;

    console.log(req.body);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if application with this user already exists
    const existingApplication = await InstructorApplication.findOne({
      user: userId,
    });
    if (existingApplication) {
      return res.status(409).json({
        message: "You already have a pending application",
      });
    }

    // Check if user is already an instructor
    const existingInstructor = await Instructor.findOne({ user: userId });
    if (existingInstructor) {
      return res.status(409).json({
        message: "You are already an approved instructor",
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

    // Extract URLs from multer (already uploaded to Cloudinary)
    const imageUrl = req.files.image[0].path;
    const documents = req.files.documents.map((file) => file.path);
    const certificates = req.files.certificates.map((file) => file.path);

    // Create new application
    const newApplication = new InstructorApplication({
      user: userId,
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
      error: error.message,
    });
  }
};

// Get all applications (for admin)
export const getApplications = async (req, res) => {
  try {
    const applications = await InstructorApplication.find().populate(
      "user",
      "name email"
    );
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching applications",
      error: error.message,
    });
  }
};

// Approve instructor
export const approveInstructor = async (req, res) => {
  try {
    const { applicationId } = req.params;

    console.log(applicationId);

    // Find instructor application
    const application = await InstructorApplication.findById(
      applicationId
    ).populate("user");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if user exists
    const user = await User.findById(application.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already an instructor
    const existingInstructor = await Instructor.findOne({ user: user._id });
    if (existingInstructor) {
      return res.status(400).json({ message: "User is already an instructor" });
    }

    // Update user role to instructor
    user.role = "instructor";
    user.image = application.image || user.image;
    user.experience = application.experience || user.experience;
    user.qualifications = application.qualifications || user.qualifications;
    user.bio = application.bio || user.bio;
    user.phone = application.phone || user.phone;
    await user.save();

    // Create new instructor
    const newInstructor = new Instructor({
      user: user._id,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      experience: application.experience,
      qualifications: application.qualifications,
      bio: application.bio,
      image: application.image,
      serviceTypes: application.serviceType,
    });

    await newInstructor.save();

    // Update application status
    application.status = "Approved";
    await application.save();

    // Send WhatsApp message to user
    if (user.phone) {
      const message = `Congratulations ${user.name}, your instructor application has been approved!`;
      await sendWhatsAppMessage(user.phone, message);
    }

    res.status(200).json({
      message: "Instructor approved successfully!",
      instructor: newInstructor,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error approving instructor:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
// Reject instructor
export const rejectInstructor = async (req, res) => {
  try {
    const { applicationId } = req.params;

    // Find the application
    const application = await InstructorApplication.findById(
      applicationId
    ).populate("user");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update application status
    application.status = "Rejected";
    await application.save();

    // Check if user exists
    const user = await User.findById(application.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user role back to user
    user.role = "user";
    await user.save();

    // Find and delete instructor record if it exists
    const instructor = await Instructor.findOneAndDelete({
      user: application.user._id,
    });

    // Send WhatsApp message to user
    if (user.phone) {
      const message = `Dear ${user.name}, your instructor application has been rejected.`;
      await sendWhatsAppMessage(user.phone, message);
    }

    res.status(200).json({
      message: "Application rejected and instructor removed successfully!",
      application: {
        id: application._id,
        status: application.status,
      },
      instructorDeleted: !!instructor,
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find({})
      .populate("user", "name email")
      .populate("classes", "className date time");

    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching instructors",
      error: error.message,
    });
  }
};

export const getInstructorById = async (req, res) => {
  const { instructorId } = req.params;

  try {
    const instructor = await Instructor.findById(instructorId)
      .populate("user", "name email")
      .populate({
        path: "classes",
        select: "className date time duration price image capacity",
        match: { status: "Approved" },
      });

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    res.status(200).json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get instructor profile for currently logged-in instructor
export const getMyInstructorProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user info in req.user from auth middleware

    const instructor = await Instructor.findOne({ user: userId })
      .populate("user", "name email")
      .populate({
        path: "classes",
        select: "className date time status",
        options: { sort: { date: -1 } },
      });

    if (!instructor) {
      return res.status(404).json({ message: "Instructor profile not found" });
    }

    res.status(200).json(instructor);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

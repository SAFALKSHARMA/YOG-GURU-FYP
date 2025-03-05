import InstructorApplication from "../models/InstructorApplication.js";
import userModel from "../models/userModel.js";

// Submit a new instructor application
export const submitApplication = async (req, res) => {
  try {
    const { fullName, email, phone, experience, qualifications, bio, image } =
      req.body;

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

    // Find and update user by email
    const updatedUser = await userModel.findOneAndUpdate(
      { email: instructorApplication.email }, // Find by email
      {
        $set: {
          role: "instructor",
          experience: instructorApplication.experience,
          phone: instructorApplication.phone,
          qualifications: instructorApplication.qualifications,
          bio: instructorApplication.bio,
          image: instructorApplication.image,
        },
      },
      { new: true, runValidators: true } // Ensure validators run
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    // Update instructor application status
    await InstructorApplication.findByIdAndUpdate(instructorId, {
      status: "Approved",
    });

    res.status(200).json({
      message: "Instructor approved successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error approving instructor:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

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

    // Update the user's role back to "user"
    const updatedUser = await userModel.findOneAndUpdate(
      { email: instructorApplication.email },
      {
        $set: {
          role: "user",
          experience: "",
          phone: "",
          qualifications: "",
          bio: "",
          image:
            "https://res.cloudinary.com/dp4gvijd6/image/upload/v1741167612/profile_ucyhch.png",
        },
      }, // Revert role to "user"
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the instructor application status to "rejected"
    instructorApplication.status = "Rejected";
    await instructorApplication.save();

    res.status(200).json({
      message: "Instructor rejected successfully!",
      user: updatedUser,
      instructor: instructorApplication,
    });
  } catch (error) {
    console.error("Error rejecting instructor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

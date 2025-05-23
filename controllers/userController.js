import userModel from "../models/userModel.js";
import Instructor from "../models/Instructor.js";
import bcrypt from "bcryptjs";
import Class from "../models/class.model.js";
import InstructorApplication from "../models/InstructorApplication.js";
import Student from "../models/student.model.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    // Ensure userId is provided
    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Find user by the provided userId
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Initialize instructorData as null
    let instructorData = null;

    // If the user's role is "instructor", fetch instructor details using the user's email
    if (user.role === "instructor") {
      instructorData = await Instructor.findOne({ email: user.email });

      if (!instructorData) {
        return res.json({
          success: false,
          message: "Instructor details not found",
        });
      }
    }

    // Return the user data along with instructor data (if applicable)
    res.json({
      success: true,
      userData: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        isAccountVerified: user.isAccountVerified,
        qualifications: user.qualifications,
        phone: user.phone,
        experience: user.experience,
        bio: user.bio,
        address: user.address,
        createdAt: user.createdAt, // ✅ Include createdAt
        favoriteClasses: user.favoriteClasses,
        enrolledClasses: user.enrolledClasses,
        cartItems: user.cartItems,
      },
      instructorData: instructorData,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users without filtering or limiting fields
    const users = await userModel.find({ role: { $ne: "admin" } });

    // Return all user data
    res.json({
      success: true,
      users,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile Image Controller
export const updateProfileImage = async (req, res) => {
  try {
    const { email, image } = req.body;

    if (!email || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Email and image URL are required." });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Update user's profile image
    user.image = image;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      image: user.image,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if the user is an instructor
    const instructor = await Instructor.findOne({ user: userId });

    if (instructor) {
      // Delete all classes created by the instructor
      await Class.deleteMany({ instructor: instructor._id });

      // Delete instructor document
      await Instructor.findByIdAndDelete(instructor._id);

      // Delete instructor applications
      await InstructorApplication.deleteMany({ user: userId });
    }

    // Delete all student records associated with the user
    await Student.deleteMany({ user: userId });

    // Delete the user
    await userModel.findByIdAndDelete(userId);

    // Clear token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message:
        "User, associated instructor, classes, and student records deleted successfully.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res
        .status(400)
        .json({ success: false, message: "Ban reason is required." });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    user.banInfo = {
      isBanned: true,
      banReason: reason,
    };

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User banned successfully." });
  } catch (error) {
    console.error("Ban User Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    user.banInfo = {
      isBanned: false,
      banReason: "",
    };

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "User unbanned successfully." });
  } catch (error) {
    console.error("Unban User Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

// Update user profile (excluding email & password)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, phone, address, bio } = req.body;

    // Validate if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update allowed fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bio = bio || user.bio;

    await user.save();

    // Also validate if the user is an instructor
    const instructor = await Instructor.findOne({ user: userId });
    if (instructor) {
      // Update instructor details if needed
      instructor.fullName = name || instructor.fullName;
      instructor.phone = phone || instructor.phone;
      instructor.address = address || instructor.address;
      instructor.bio = bio || instructor.bio;

      await instructor.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user, // Optionally return updated user info
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile",
    });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await userModel.find({ role: "admin" });

    return res.status(200).json({
      success: true,
      admins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, email, and password",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "admin", // Make sure to set the role as admin
    });

    await user.save();

    // Return success response (omit password in response)
    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Validate input
    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user by userId
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Validate new password (basic example, adjust as needed)
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

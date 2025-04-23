import userModel from "../models/userModel.js";
import Instructor from "../models/Instructor.js";

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
    const users = await userModel.find();

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

// DELETE USER CONTROLLER
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    await userModel.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
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

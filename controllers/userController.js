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
      },
      instructorData: instructorData, // Include instructor data if role is "instructor"
    });
  } catch (error) {
    // Return the error message in the response
    res.json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    // Fetch only verified users
    const users = await userModel.find(
      { isAccountVerified: true },
      "name email role isAccountVerified image qualifications experience phone bio"
    );

    // Return the filtered users' data
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

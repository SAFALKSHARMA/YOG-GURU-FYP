import TrackProgress from "../models/TrackProgress.js";
import mongoose from "mongoose";

// Create a new progress entry
export const createProgressEntry = async (req, res) => {
  try {
    const { userId, className, classDate, learnedToday, todaysPlan } = req.body;

    // Validate required fields
    if (!userId || !className || !classDate) {
      return res.status(400).json({
        success: false,
        message: "userId, className, and classDate are required fields",
      });
    }

    // Validate date format
    if (isNaN(new Date(classDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for classDate",
      });
    }

    // Create new entry
    const newEntry = new TrackProgress({
      userId,
      className,
      classDate: new Date(classDate),
      learnedToday,
      todaysPlan,
    });

    // Save to database
    const savedEntry = await newEntry.save();

    res.status(201).json({
      success: true,
      message: "Progress entry created successfully",
      data: savedEntry,
    });
  } catch (error) {
    console.error("Error creating progress entry:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all progress entries for a user
export const getUserProgressEntries = async (req, res) => {
  try {
    const { userId } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Find all entries for the user, sorted by most recent first
    const entries = await TrackProgress.find({ userId })
      .sort({ classDate: -1, createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: "Progress entries retrieved successfully",
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching progress entries:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProgressEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Validate id and userId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid entry ID format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Find the entry and verify ownership before deleting
    const entry = await TrackProgress.findOne({ _id: id, userId });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Progress entry not found or unauthorized",
      });
    }

    await TrackProgress.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Progress entry deleted successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Error deleting progress entry:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

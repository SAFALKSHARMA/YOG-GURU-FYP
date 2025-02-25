import InstructorApplication from "../models/InstructorApplication.js";

// Submit a new instructor application
export const submitApplication = async (req, res) => {
  try {
    const { fullName, email, phone, experience, qualifications, bio } =
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

// Approve or reject an application
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedApplication = await InstructorApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({
      message: "Application status updated",
      data: updatedApplication,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

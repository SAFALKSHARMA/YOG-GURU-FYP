import Class from "../models/class.model.js";
import Instructor from "../models/Instructor.js";
import Student from "../models/student.model.js";
import YogaAccessory from "../models/shop.js";
import InstructorApplication from "../models/InstructorApplication.js";
import userModel from "../models/userModel.js";
import YogaBooking from "../models/booking.model.js";

export const getAdminDashboard = async (req, res) => {
  try {
    // Get counts for all important collections
    const [
      totalUsers,
      totalInstructors,
      totalStudents,
      totalClasses,
      totalApplications,
      totalProducts,
      pendingClasses,
      pendingApplications,
      recentUsers,
      recentClasses,
      recentApplications,
    ] = await Promise.all([
      userModel.countDocuments(),
      Instructor.countDocuments(),
      Student.countDocuments(),
      Class.countDocuments(),
      InstructorApplication.countDocuments(),
      YogaAccessory.countDocuments(),
      Class.countDocuments({ status: "Pending" }),
      InstructorApplication.countDocuments({ status: "Pending" }),
      userModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role createdAt image"),
      Class.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("className instructor date time status"),
      InstructorApplication.find({ status: "Pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName email experience status createdAt"),
    ]);

    // Get counts by user roles
    const userRoles = await userModel.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get class status counts
    const classStatuses = await Class.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get application status counts
    const applicationStatuses = await InstructorApplication.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the response
    const dashboardStats = {
      totals: {
        users: totalUsers,
        instructors: totalInstructors,
        students: totalStudents,
        classes: totalClasses,
        applications: totalApplications,
        products: totalProducts,
        pendingClasses,
        pendingApplications,
      },
      recent: {
        users: recentUsers,
        classes: recentClasses,
        applications: recentApplications,
      },
      breakdowns: {
        userRoles,
        classStatuses,
        applicationStatuses,
      },
    };

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: dashboardStats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

export const getInstructorDashboardData = async (req, res) => {
  try {
    const { instructorId } = req.params;

    // Fetch instructor profile
    const instructor = await Instructor.findById(instructorId).select(
      "fullName email phone experience qualifications image"
    );

    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Get all classes taught by this instructor
    const classes = await Class.find({ instructor: instructorId }).select(
      "_id students"
    );

    const totalClasses = classes.length;

    // Flatten and deduplicate student IDs from all classes
    const studentIds = [
      ...new Set(
        classes.flatMap((cls) => cls.students.map((id) => id.toString()))
      ),
    ];

    const totalStudents = studentIds.length;

    // Get bookings count and recent bookings
    const totalBookings = await YogaBooking.countDocuments({ instructorId });

    const recentBookings = await YogaBooking.find({ instructorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "fullName email phoneNumber preferredDate preferredTime sessionDuration sessionLocation status"
      );

    // Get recent joined users (students only)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await userModel
      .find({
        role: "user",
        createdAt: { $gte: sevenDaysAgo },
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email image createdAt");

    const recentUsersCount = await userModel.countDocuments({
      role: "user",
      createdAt: { $gte: sevenDaysAgo },
    });

    res.json({
      instructor,
      stats: {
        totalClasses,
        totalStudents,
        totalBookings,
        recentUsersCount,
      },
      recentBookings,
      recentUsers,
    });
  } catch (error) {
    console.error("Error in instructor dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

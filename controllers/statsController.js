import Class from "../models/class.model.js";
import Instructor from "../models/Instructor.js";
import studentModel from "../models/student.model.js";
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
      totalApprovedClasses,
      totalApprovedApplications,
      totalProducts,
      pendingClasses,
      pendingApplications,
      recentUsers,
      recentClasses,
      recentApplications,
    ] = await Promise.all([
      userModel.countDocuments(),
      Instructor.countDocuments(),
      studentModel.countDocuments(),
      Class.countDocuments({ status: "Approved" }), // Only approved classes
      InstructorApplication.countDocuments({ status: "Approved" }), // Only approved applications
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
        classes: totalApprovedClasses, // updated
        applications: totalApprovedApplications, // updated
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

    // Get all classes taught by this instructor with complete details
    const classes = await Class.find({ instructor: instructorId }).select(
      "className description date time duration capacity price image difficultyLevel status students"
    );

    const totalClasses = classes.length;

    // Get students count and recent students from studentModel
    const students = await studentModel
      .find({ instructorId })
      .populate("user", "name email image") // Populate user details
      .populate("classId", "className date time"); // Populate more class details

    const totalStudents = students.length;

    // Get recent students (last 5)
    const recentStudents = await studentModel
      .find({ instructorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email image")
      .populate("classId", "className date time image");

    // Format recent students data with more class details
    const formattedRecentStudents = recentStudents.map((student) => ({
      _id: student._id,
      user: student.user,
      class: {
        _id: student.classId?._id,
        name: student.classId?.className,
        date: student.classId?.date,
        time: student.classId?.time,
        image: student.classId?.image,
      },
      enrolledAt: student.createdAt,
    }));

    // Get bookings count and recent bookings
    const totalBookings = await YogaBooking.countDocuments({ instructorId });

    const recentBookings = await YogaBooking.find({ instructorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select(
        "fullName email phoneNumber preferredDate preferredTime sessionDuration sessionLocation status"
      );

    // Format classes data with student count for each
    const formattedClasses = classes.map((cls) => ({
      _id: cls._id,
      name: cls.className,
      description: cls.description,
      date: cls.date,
      time: cls.time,
      duration: cls.duration,
      capacity: cls.capacity,
      price: cls.price,
      image: cls.image,
      difficultyLevel: cls.difficultyLevel,
      status: cls.status,
      studentCount: cls.students.length,
      remainingCapacity: cls.capacity - cls.students.length,
    }));

    res.json({
      instructor,
      stats: {
        totalClasses,
        totalStudents,
        totalBookings,
        upcomingClasses: classes.filter(
          (cls) => new Date(cls.date) > new Date()
        ).length,
        completedClasses: classes.filter(
          (cls) => new Date(cls.date) <= new Date()
        ).length,
      },
      recentBookings,
      recentStudents: formattedRecentStudents,
      classes: formattedClasses, // Include detailed classes data
    });
  } catch (error) {
    console.error("Error in instructor dashboard:", error);
    res.status(500).json({ message: "Server error" });
  }
};

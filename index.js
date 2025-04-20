import express from "express";
import connectDB from "./db.js"; // Import the DB connection
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import Instructor from "./models/Instructor.js";
import shopRoutes from "./routes/shopRoutes.js";
import yogaBookingRoutes from "./routes/bookingRoutes.js";

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

app.use(express.urlencoded({ extended: true })); // For form-data (application/x-www-form-urlencoded)
app.use(express.json()); // Middleware to parse JSON data
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin || "*"); // Allow all origins dynamically
    },
    credentials: true, // Allow credentials (cookies, auth headers, etc.)
  })
);

// // Session setup
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false, // Only create session if authenticated
//     cookie: {
//       secure: process.env.NODE_ENV === "production", // Only set cookie over HTTPS in production
//       httpOnly: true, // Ensures the cookie can't be accessed via JavaScript
//       maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (24 hours)
//     },
//   })
// );

app.get("/", (req, res) => {
  res.send("API Working");
});

// Define routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/instructors", instructorRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/bookings", yogaBookingRoutes);

// Example backend route in Node.js (Express)
app.get("/api/classes/instructor/:instructorId", async (req, res) => {
  try {
    const instructorId = req.params.instructorId;
    const instructor = await Instructor.findById(instructorId).populate(
      "classes"
    );

    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor not found" });
    }

    res.json({ success: true, classes: instructor.classes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route to fetch all instructors
app.get("/api/instructors/all-instructors", async (req, res) => {
  try {
    const instructors = await Instructor.find(); // Fetches all instructors
    res.status(200).json(instructors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching instructors" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

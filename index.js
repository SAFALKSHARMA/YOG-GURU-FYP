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
import trackRoutes from "./routes/trackRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import whatsappRoutes from "./routes/whatsappRoute.js";

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
app.use("/api/track", trackRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

import express from "express";
import connectDB from "./db.js"; // Import the DB connection
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const PORT = 5000;

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

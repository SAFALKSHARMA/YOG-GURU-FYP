import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI is not defined in the environment variables.");
  process.exit(1); // Exit the process with an error code
}

// console.log("MONGO_URI:", uri); // Debugging log

export default async function connectDB() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
}

// server.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Importing Routes
import allUserRouter from "./AllUsers/allUserRoute.js";
import userRouter from "./Users/userRoute.js";
import listerRouter from "./Lister/listerRoute.js";
import adminRouter from "./Admin/adminRoutes.js"; 
import reportRouter from "./Reports/reportRoute.js"

// Load environment variables
// dotenv.config({ path: `.env.local` })

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000' ,
    credentials: true,
  })
);
app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", allUserRouter);
app.use("/api/users", userRouter);
app.use("/api/listers", listerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/report", reportRouter)
// Test route
app.get("/test", (req, res) => {
  res.send("Yo this works!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
});

// MongoDB Connection and Server Start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  });

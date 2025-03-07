import express from "express";
import cors from "cors";
import allUserRouter from "./AllUsers/allUserRoute.js";
import userRouter from "./Users/userRoute.js";
import listerRouter from "./Lister/listerRoute.js";
import adminRouter from "./Admin/adminRoutes.js";
import "dotenv/config";
import reportRouter from "./Reports/reportRoute.js";


const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000' || process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", allUserRouter);
app.use("/api/users", userRouter);
app.use("/api/listers", listerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/report", reportRouter); 


// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal server error",
    error: err.message
  });
});

export default app;
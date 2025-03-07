import express from "express";
import AllUserDB from "./allUsers.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const allUserRouter = express.Router();

// Signup route
allUserRouter.post("/signup", async (req, res) => {
  try {
    const { username, password, role, name } = req.body;

    // Check if user already exists
    const existingUser = await AllUserDB.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new AllUserDB({
      username,
      password: hashedPassword,
      role,
      name
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, username: newUser.username, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        username: newUser.username,
        role: newUser.role,
        name: newUser.name
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Sign In route
// Sign In route
allUserRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Admin login logic
    if (username === 'admin' && password === 'admin123') {
      return res.status(200).json({
        user: {
          id: "admin-1",
          username: "admin",
          name: "Admin User",
          role: "admin",
          hasCompletedOnboarding: true,
        },
      });
    }

    // Regular user authentication
    const user = await AllUserDB.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare provided password with hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


export default allUserRouter;

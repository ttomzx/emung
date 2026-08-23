import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Family from "../models/Family.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "emung_secret_jwt_key_2026", {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate("family");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        family: user.family,
        memberProfile: user.memberProfile,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, familyName, familyCode } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    let family;
    let role = "member";

    if (familyName) {
      // Create new family unit
      const code = familyCode || `EMUNG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      family = await Family.create({
        name: familyName,
        familyCode: code,
      });
      role = "admin";
    } else {
      // Find default or by code
      const codeToSearch = familyCode || "EMUNG-MAIN";
      family = await Family.findOne({ familyCode: codeToSearch });
      if (!family) {
        family = await Family.create({
          name: "Emung Family Heritage",
          familyCode: "EMUNG-MAIN",
        });
      }
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      family: family._id,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      family,
      memberProfile: user.memberProfile,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("family");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

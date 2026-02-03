import express from "express";
import bcrypt from "bcryptjs";
import { authenticateToken, generateToken } from "../middleware/auth.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
  try {
    console.log("🚀 Registration endpoint called");
    console.log("🚀 Request body:", req.body);

    const { name, email, password, phoneNumber } = req.body;

    console.log("🚀 Extracted data:", {
      name,
      email,
      phoneNumber,
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", existingUser.email);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    console.log("User doesn't exist, creating new user...");

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name: name || "User",
      email,
      password: hashedPassword,
      phoneNumber,
      availableProposals: 0, // No free proposals - must purchase plan
      role: "user",
    });

    console.log("🚀 New user object:", newUser);

    await newUser.save();
    console.log("User saved to database with ID:", newUser._id);

    // Generate JWT token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        availableProposals: newUser.availableProposals,
        currentPlan: newUser.currentPlan,
        planStatus: newUser.planStatus,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for user:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("Login successful for user:", email);

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        availableProposals: user.availableProposals,
        profiles: user.profiles,
        currentPlan: user.currentPlan,
        planStatus: user.planStatus,
        planExpirationDate: user.planExpirationDate,
        planPurchaseDate: user.planPurchaseDate,
        billingPeriod: user.billingPeriod,
        subscriptionId: user.subscriptionId,
        subscriptionToken: user.subscriptionToken,
        nextBillingDate: user.nextBillingDate,
        lastBillingDate: user.lastBillingDate,
        billingFrequency: user.billingFrequency,
        recurringAmount: user.recurringAmount,
        completedBillingCycles: user.completedBillingCycles,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

// Get current user profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // req.user is already the User document from the auth middleware
    // Just populate the profiles and return the user data
    const user = await User.findById(req.user._id).populate("profiles");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        availableProposals: user.availableProposals,
        profiles: user.profiles,
        currentPlan: user.currentPlan,
        planStatus: user.planStatus,
        planExpirationDate: user.planExpirationDate,
        planPurchaseDate: user.planPurchaseDate,
        billingPeriod: user.billingPeriod,
        subscriptionId: user.subscriptionId,
        subscriptionToken: user.subscriptionToken,
        nextBillingDate: user.nextBillingDate,
        lastBillingDate: user.lastBillingDate,
        billingFrequency: user.billingFrequency,
        recurringAmount: user.recurringAmount,
        completedBillingCycles: user.completedBillingCycles,
      },
    });
  } catch (error) {
    console.error("❌ [AUTH] Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    });
  }
});

// Create new profile (deprecated - use /api/profiles instead)
router.post("/profiles", authenticateToken, async (req, res) => {
  try {
    const {
      profileName,
      description,
      firstName,
      lastName,
      profession,
      skills,
    } = req.body;

    // Create new profile
    const newProfile = new Profile({
      profileName,
      description,
      firstName,
      lastName,
      profession,
      skills,
    });

    await newProfile.save();

    // Add profile to user
    const user = await User.findById(req.user._id);
    user.profiles.push(newProfile._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    console.error("Create profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: error.message,
    });
  }
});

// Get user profiles (deprecated - use /api/profiles instead)
router.get("/profiles", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("profiles");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      profiles: user.profiles,
    });
  } catch (error) {
    console.error("Get profiles error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profiles",
      error: error.message,
    });
  }
});

export default router;

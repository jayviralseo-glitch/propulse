import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const authenticateToken = async (req, res, next) => {
  try {
    console.log("🔍 Auth middleware called for:", req.originalUrl);
    console.log("🔍 Request headers:", req.headers);

    const authHeader = req.headers.authorization;
    console.log("🔍 Authorization header:", authHeader);

    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    console.log(
      "🔍 Extracted token:",
      token ? `${token.substring(0, 20)}...` : null
    );
    console.log("🔍 Token length:", token ? token.length : 0);

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    try {
      console.log("🔍 Attempting to verify JWT token...");
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("🔍 JWT decoded successfully:", {
        userId: decoded.userId,
        iat: decoded.iat,
        exp: decoded.exp,
      });
      console.log("🔍 Current time:", new Date().toISOString());
      console.log(
        "🔍 Token expiration:",
        new Date(decoded.exp * 1000).toISOString()
      );

      // Find user in database by ID
      console.log("🔍 Looking for user with ID:", decoded.userId);
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log("❌ User not found in database for ID:", decoded.userId);
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      console.log("✅ User authenticated successfully:", {
        email: user.email,
        userId: user._id,
      });
      req.user = user;
      next();
    } catch (jwtError) {
      console.log("❌ JWT token verification failed:", jwtError.message);
      console.log("❌ JWT error details:", jwtError);
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Middleware to check if user's plan is expired (real-time check)
export const checkPlanExpiration = async (req, res, next) => {
  try {
    const user = req.user; // User is already set by authenticateToken

    // Check if user's plan has expired
    if (user.planExpirationDate && new Date() > user.planExpirationDate) {
      // Plan has expired - automatically update user status
      user.planStatus = "expired";
      user.availableProposals = 0;
      await user.save();

      return res.status(403).json({
        error: "Plan expired",
        message: "Your subscription has expired. Please renew to continue.",
      });
    }

    // Plan is still active, continue
    next();
  } catch (error) {
    console.error("Plan expiration check error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking plan status",
    });
  }
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Optional: Check if user is admin
export const requireAdmin = async (req, res, next) => {
  try {
    // First authenticate the token
    await authenticateToken(req, res, async () => {
      // Check if user has admin role
      if (req.user && req.user.role === "admin") {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Admin access required",
        });
      }
    });
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization error",
    });
  }
};

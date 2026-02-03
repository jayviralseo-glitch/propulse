import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { authenticateToken, checkPlanExpiration } from "../middleware/auth.js";

const router = express.Router();

// Get all profiles for the authenticated user
router.get("/", authenticateToken, checkPlanExpiration, async (req, res) => {
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

// Get a single profile by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Check if user owns this profile
    const user = await User.findById(req.user._id);
    if (!user.profiles.includes(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      profile: profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
});

// Create a new profile or update existing one if upworkProfileId matches
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Debug logging - Backend received data
    console.log("📥 [BACKEND] Profile creation request from:", req.user.email);
    console.log("📥 [BACKEND] Upwork Profile ID:", req.body.upworkProfileId);

    let savedProfile;
    let isUpdate = false;

    // Check if upworkProfileId exists and if profile already exists
    if (req.body.upworkProfileId) {
      const existingProfile = await Profile.findOne({
        upworkProfileId: req.body.upworkProfileId,
      });

      if (existingProfile) {
        // Check if user owns this profile
        const user = await User.findById(req.user._id);
        if (user.profiles.includes(existingProfile._id)) {
          // Update existing profile
          console.log(
            "🔄 [BACKEND] Updating existing profile:",
            existingProfile.profileName,
          );
          savedProfile = await Profile.findByIdAndUpdate(
            existingProfile._id,
            req.body,
            { new: true, runValidators: true },
          );
          isUpdate = true;
        } else {
          // Profile exists but belongs to another user
          return res.status(403).json({
            success: false,
            message: "This Upwork profile is already imported by another user",
          });
        }
      }
    }

    // Create new profile if not updating
    if (!isUpdate) {
      const profile = new Profile(req.body);
      savedProfile = await profile.save();

      // Add profile to user
      await User.findByIdAndUpdate(req.user._id, {
        $push: { profiles: savedProfile._id },
      });

      console.log("✅ [BACKEND] Profile created:", savedProfile.profileName);
    } else {
      console.log("✅ [BACKEND] Profile updated:", savedProfile.profileName);
    }

    res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: isUpdate
        ? "Profile updated successfully"
        : "Profile created successfully",
      profile: savedProfile,
      isUpdate: isUpdate,
    });
  } catch (error) {
    // Debug logging - Backend error
    console.error("❌ [BACKEND] Profile creation failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: error.message,
    });
  }
});

// Update a profile
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user owns this profile
    const user = await User.findById(req.user._id);
    if (!user.profiles.includes(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// Delete a profile
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user owns this profile
    const user = await User.findById(req.user._id);
    if (!user.profiles.includes(req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await Profile.findByIdAndDelete(req.params.id);

    // Remove profile from user
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { profiles: req.params.id },
    });

    res.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete profile",
      error: error.message,
    });
  }
});

export default router;

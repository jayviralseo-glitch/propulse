import express from "express";
import User from "../../models/User.js";
import Profile from "../../models/Profile.js";
import Payment from "../../models/Payment.js";
import History from "../../models/History.js";
import { authenticateToken, requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all users with pagination and search
router.get("/", requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      status = "",
    } = req.query;

    const query = {};

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by subscription status
    if (status && status !== "all") {
      query.planStatus = status;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .populate("profiles", "profileName profession")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user with detailed information
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("profiles")
      .populate("subscriptionId");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user statistics
    const proposalCount = await History.countDocuments({
      userId: req.params.id,
    });
    const paymentCount = await Payment.countDocuments({
      userId: req.params.id,
    });
    const activeProfiles = await Profile.countDocuments({
      _id: { $in: user.profiles },
      active: true,
    });

    const userData = {
      ...user.toObject(),
      stats: {
        totalProposals: proposalCount,
        totalPayments: paymentCount,
        activeProfiles,
      },
    };

    res.json({ success: true, data: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role
router.patch("/:id/role", requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user subscription status
router.patch("/:id/subscription", requireAdmin, async (req, res) => {
  try {
    const { currentPlan, planStatus } = req.body;

    if (currentPlan) updateData.currentPlan = currentPlan;
    if (planStatus) updateData.planStatus = planStatus;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (soft delete - mark as inactive)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        planStatus: "cancelled",
        active: false,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user analytics
router.get("/:id/analytics", requireAdmin, async (req, res) => {
  try {
    const { period = "30d" } = req.query;
    const userId = req.params.id;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case "7d":
        dateFilter = {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      case "30d":
        dateFilter = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
        break;
      case "90d":
        dateFilter = {
          $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        dateFilter = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
    }

    const proposals = await History.find({
      userId,
      createdAt: dateFilter,
    }).sort({ createdAt: 1 });

    const payments = await Payment.find({
      userId,
      createdAt: dateFilter,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        proposals,
        payments,
        period,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

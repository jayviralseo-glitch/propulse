import express from "express";
import { authenticateToken, checkPlanExpiration } from "../middleware/auth.js";
import History from "../models/History.js";
import User from "../models/User.js";

const router = express.Router();

// Get all history for the authenticated user
router.get("/", authenticateToken, checkPlanExpiration, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id })
      .populate("profileId", "profileName firstName lastName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      history: history,
    });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get history",
      error: error.message,
    });
  }
});

// Get history for a specific profile
router.get("/profile/:profileId", authenticateToken, async (req, res) => {
  try {
    const history = await History.find({
      userId: req.user._id,
      profileId: req.params.profileId,
    })
      .populate("profileId", "profileName firstName lastName")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      history: history,
    });
  } catch (error) {
    console.error("Get profile history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile history",
      error: error.message,
    });
  }
});

// Create new history entry (when proposal is generated)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const history = new History({
      ...req.body,
      userId: req.user._id,
    });

    const savedHistory = await history.save();
    res.status(201).json({
      success: true,
      message: "History entry created successfully",
      history: savedHistory,
    });
  } catch (error) {
    console.error("Create history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create history",
      error: error.message,
    });
  }
});

// Delete history entry
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const history = await History.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History not found",
      });
    }

    res.json({
      success: true,
      message: "History deleted successfully",
    });
  } catch (error) {
    console.error("Delete history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete history",
      error: error.message,
    });
  }
});

// Get analytics data for charts
router.get("/analytics", authenticateToken, async (req, res) => {
  try {
    const { period = "7d" } = req.query;

    let dateFilter = {};
    const now = new Date();

    // Calculate date range based on period
    switch (period) {
      case "7d":
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      case "30d":
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      case "90d":
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      default:
        dateFilter = {
          createdAt: {
            $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        };
    }

    // Aggregate proposals by date
    const dailyStats = await History.aggregate([
      { $match: { userId: req.user._id, ...dateFilter } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get total count for summary
    const totalStats = await History.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          totalProposals: { $sum: 1 },
        },
      },
    ]);

    // Fill in missing dates with zero values
    const filledData = [];
    const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const existingData = dailyStats.find((item) => item._id === dateStr);

      filledData.push({
        date: dateStr,
        total: existingData ? existingData.count : 0,
      });
    }

    res.json({
      success: true,
      analytics: {
        dailyData: filledData,
        summary: totalStats[0] || {
          totalProposals: 0,
        },
      },
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get analytics",
      error: error.message,
    });
  }
});

// Get dashboard stats (total proposals, this week, etc.)
router.get("/dashboard-stats", authenticateToken, async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get total proposals count
    const totalProposals = await History.countDocuments({
      userId: req.user._id,
    });

    // Get this week's proposals count
    const thisWeekProposals = await History.countDocuments({
      userId: req.user._id,
      createdAt: { $gte: startOfWeek },
    });

    // Get active profiles count (from user's profiles array)
    const user = await User.findById(req.user._id);
    const activeProfiles = user.profiles ? user.profiles.length : 0;

    res.json({
      success: true,
      stats: {
        totalProposals,
        thisWeekProposals,
        activeProfiles,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard stats",
      error: error.message,
    });
  }
});

export default router;

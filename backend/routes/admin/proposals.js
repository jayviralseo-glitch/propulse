import express from "express";
import History from "../../models/History.js";
import User from "../../models/User.js";
import Profile from "../../models/Profile.js";
import { authenticateToken, requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get overall proposal statistics
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const { period = "30d" } = req.query;

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
      case "1y":
        dateFilter = {
          $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        dateFilter = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
    }

    // Get total proposals in period
    const totalProposals = await History.countDocuments({
      createdAt: dateFilter,
    });

    // Get total proposals all time
    const totalProposalsAllTime = await History.countDocuments({});

    // Get unique users who generated proposals in period
    const uniqueUsers = await History.distinct("userId", {
      createdAt: dateFilter,
    });
    const activeUsers = uniqueUsers.length;

    // Get total users
    const totalUsers = await User.countDocuments({});

    // Get average proposals per user in period
    const avgProposalsPerUser =
      activeUsers > 0 ? (totalProposals / activeUsers).toFixed(2) : 0;

    // Get proposals by day for chart
    const proposalsByDay = await History.aggregate([
      { $match: { createdAt: dateFilter } },
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

    // Get top users by proposal count
    const topUsers = await History.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: "$userId",
          proposalCount: { $sum: 1 },
        },
      },
      { $sort: { proposalCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          userId: "$_id",
          proposalCount: 1,
          userName: { $arrayElemAt: ["$user.name", 0] },
          userEmail: { $arrayElemAt: ["$user.email", 0] },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        period,
        totalProposals,
        totalProposalsAllTime,
        activeUsers,
        totalUsers,
        avgProposalsPerUser: parseFloat(avgProposalsPerUser),
        proposalsByDay,
        topUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get proposals with pagination and filters
router.get("/", requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      userId = "",
      profileId = "",
      startDate = "",
      endDate = "",
    } = req.query;

    const query = {};

    // Search by job description
    if (search) {
      query.jobDescription = { $regex: search, $options: "i" };
    }

    // Filter by user
    if (userId) {
      query.userId = userId;
    }

    // Filter by profile
    if (profileId) {
      query.profileId = profileId;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const proposals = await History.find(query)
      .populate("userId", "name email")
      .populate("profileId", "profileName profession")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await History.countDocuments(query);

    res.json({
      success: true,
      data: proposals,
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

// Get single proposal details
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const proposal = await History.findById(req.params.id)
      .populate("userId", "name email phoneNumber")
      .populate("profileId", "profileName profession skills");

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    res.json({ success: true, data: proposal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get proposals by user
router.get("/user/:userId", requireAdmin, async (req, res) => {
  try {
    const { period = "30d" } = req.query;
    const { userId } = req.params;

    let dateFilter = { userId };
    const now = new Date();

    switch (period) {
      case "7d":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      case "30d":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
        break;
      case "90d":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
    }

    const proposals = await History.find(dateFilter)
      .populate("profileId", "profileName profession")
      .sort({ createdAt: -1 });

    const totalProposals = await History.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        proposals,
        totalProposals,
        periodProposals: proposals.length,
        period,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get proposals by profile
router.get("/profile/:profileId", requireAdmin, async (req, res) => {
  try {
    const { period = "30d" } = req.query;
    const { profileId } = req.params;

    let dateFilter = { profileId };
    const now = new Date();

    switch (period) {
      case "7d":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      case "30d":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
        break;
      case "90d":
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        dateFilter.createdAt = {
          $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        };
    }

    const proposals = await History.find(dateFilter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const totalProposals = await History.countDocuments({ profileId });

    res.json({
      success: true,
      data: {
        proposals,
        totalProposals,
        periodProposals: proposals.length,
        period,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete proposal (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const proposal = await History.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    await History.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

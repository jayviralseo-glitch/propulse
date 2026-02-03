import express from "express";
import Payment from "../../models/Payment.js";
import User from "../../models/User.js";
import PricingPlan from "../../models/PricingPlan.js";
import { authenticateToken, requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all payments with pagination and filters
router.get("/", requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = "",
      paymentMethod = "",
      startDate = "",
      endDate = "",
      userId = "",
      search = "",
      planName = "",
    } = req.query;

    const query = {};

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by payment method
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    // Filter by user
    if (userId) {
      query.userId = userId;
    }

    // Search filter (search in user name, email, or payment ID)
    if (search) {
      query.$or = [
        { paymentId: { $regex: search, $options: "i" } },
        { "userId.name": { $regex: search, $options: "i" } },
        { "userId.email": { $regex: search, $options: "i" } },
      ];
    }

    // Filter by plan name
    if (planName && planName !== "all") {
      query["planId.name"] = planName;
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

    const payments = await Payment.find(query)
      .populate("userId", "name email")
      .populate("planId", "name monthlyPriceUsd")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: payments,
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

// Get payment statistics
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

    // Get total payments in period
    const totalPayments = await Payment.countDocuments({
      createdAt: dateFilter,
    });

    // Get total payments all time
    const totalPaymentsAllTime = await Payment.countDocuments({});

    // Get total revenue in period
    const revenueResult = await Payment.aggregate([
      { $match: { createdAt: dateFilter, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get total revenue all time
    const revenueAllTimeResult = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenueAllTime =
      revenueAllTimeResult.length > 0 ? revenueAllTimeResult[0].total : 0;

    // Get payments by status
    const paymentsByStatus = await Payment.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get payments by day for chart
    const paymentsByDay = await Payment.aggregate([
      { $match: { createdAt: dateFilter, status: "completed" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get top plans by revenue
    const topPlans = await Payment.aggregate([
      { $match: { createdAt: dateFilter, status: "completed" } },
      {
        $group: {
          _id: "$planId",
          totalRevenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "pricingplans",
          localField: "_id",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $project: {
          planId: "$_id",
          planName: { $arrayElemAt: ["$plan.name", 0] },
          totalRevenue: 1,
          count: 1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        period,
        totalPayments,
        totalPaymentsAllTime,
        totalRevenue,
        totalRevenueAllTime,
        paymentsByStatus,
        paymentsByDay,
        topPlans,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single payment details
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("userId", "name email phoneNumber")
      .populate("planId", "name monthlyPriceUsd monthlyProposals");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update payment status
router.patch("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status, verificationStatus } = req.body;

    if (
      status &&
      !["pending", "completed", "failed", "cancelled"].includes(status)
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }

    if (
      verificationStatus &&
      !["pending", "verified", "failed"].includes(verificationStatus)
    ) {
      return res.status(400).json({ error: "Invalid verification status" });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (verificationStatus) updateData.verificationStatus = verificationStatus;

    const payment = await Payment.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("userId", "name email");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payments by user
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

    const payments = await Payment.find(dateFilter)
      .populate("planId", "name monthlyPriceUsd")
      .sort({ createdAt: -1 });

    const totalPayments = await Payment.countDocuments({ userId });
    const totalSpent = await Payment.aggregate([
      { $match: { userId, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      success: true,
      data: {
        payments,
        totalPayments,
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
        periodPayments: payments.length,
        period,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get failed payments for review
router.get("/failed/review", requireAdmin, async (req, res) => {
  try {
    const failedPayments = await Payment.find({
      status: "failed",
    })
      .populate("userId", "name email")
      .populate("planId", "name monthlyPriceUsd")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: failedPayments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retry failed payment
router.post("/:id/retry", requireAdmin, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (payment.status !== "failed") {
      return res.status(400).json({ error: "Payment is not failed" });
    }

    // Reset payment status for retry
    payment.status = "pending";
    payment.verificationStatus = "pending";
    await payment.save();

    res.json({
      success: true,
      message: "Payment reset for retry",
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from "express";
import PricingPlan from "../../models/PricingPlan.js";
import User from "../../models/User.js";
import { authenticateToken, requireAdmin } from "../../middleware/auth.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all pricing plans with pagination
router.get("/", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;

    const query = {};
    if (active !== undefined) {
      query.active = active === "true";
    }

    const skip = (page - 1) * limit;

    const plans = await PricingPlan.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get subscriber counts for each plan
    const plansWithSubscribers = await Promise.all(
      plans.map(async (plan) => {
        // Debug: Log plan name and search query

        const userCount = await User.countDocuments({
          currentPlan: { $regex: new RegExp(`^${plan.name}$`, "i") },
          planStatus: "active",
        });


        return {
          ...plan.toObject(),
          usage: {
            activeSubscribers: userCount,
          },
        };
      })
    );

    // Debug: Show all users and their plan info
    const allUsers = await User.find({}, "name currentPlan planStatus");

    const total = await PricingPlan.countDocuments(query);

    res.json({
      success: true,
      data: plansWithSubscribers,
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

// Get single pricing plan
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    // Get usage statistics
    const userCount = await User.countDocuments({
      currentPlan: { $regex: new RegExp(`^${plan.name}$`, "i") },
      planStatus: "active",
    });

    const planData = {
      ...plan.toObject(),
      usage: {
        activeSubscribers: userCount,
      },
    };

    res.json({ success: true, data: planData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new pricing plan
router.post("/", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      monthlyPriceUsd,
      monthlyProposals,
      popular,
      order,
      active,
      features,
    } = req.body;

    // Validate required fields
    if (!name || !slug || !monthlyPriceUsd || !monthlyProposals) {
      return res.status(400).json({
        error: "Name, slug, monthly price, and monthly proposals are required",
      });
    }

    // Check if slug already exists
    const existingPlan = await PricingPlan.findOne({ slug });
    if (existingPlan) {
      return res.status(400).json({ error: "Slug already exists" });
    }

    const plan = new PricingPlan({
      name,
      slug,
      description,
      monthlyPriceUsd,
      monthlyProposals,
      popular: popular || false,
      order: order || 0,
      active: active !== undefined ? active : true,
      features: features || [],
    });

    await plan.save();

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update pricing plan
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      monthlyPriceUsd,
      monthlyProposals,
      popular,
      order,
      active,
      features,
    } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (monthlyPriceUsd !== undefined)
      updateData.monthlyPriceUsd = monthlyPriceUsd;
    if (monthlyProposals !== undefined)
      updateData.monthlyProposals = monthlyProposals;
    if (popular !== undefined) updateData.popular = popular;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;
    if (features !== undefined) updateData.features = features;

    // Check if slug already exists (if being updated)
    if (slug) {
      const existingPlan = await PricingPlan.findOne({
        slug,
        _id: { $ne: req.params.id },
      });
      if (existingPlan) {
        return res.status(400).json({ error: "Slug already exists" });
      }
    }

    const plan = await PricingPlan.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete pricing plan
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    // Check if plan has active subscribers
    const activeUsers = await User.countDocuments({
      currentPlan: { $regex: new RegExp(`^${plan.name}$`, "i") },
      planStatus: "active",
    });

    if (activeUsers > 0) {
      return res.status(400).json({
        error: `Cannot delete plan with ${activeUsers} active subscribers`,
      });
    }

    await PricingPlan.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Pricing plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle plan active status
router.patch("/:id/toggle", requireAdmin, async (req, res) => {
  try {
    const plan = await PricingPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    plan.active = !plan.active;
    await plan.save();

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update plan order
router.patch("/:id/order", requireAdmin, async (req, res) => {
  try {
    const { order } = req.body;

    if (typeof order !== "number" || order < 0) {
      return res.status(400).json({ error: "Order must be a positive number" });
    }

    const plan = await PricingPlan.findByIdAndUpdate(
      req.params.id,
      { order },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ error: "Pricing plan not found" });
    }

    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

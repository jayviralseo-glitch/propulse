import express from "express";
import PricingPlan from "../models/PricingPlan.js";

const router = express.Router();

// GET /api/pricing-plans - Get all active pricing plans
router.get("/", async (req, res) => {
  try {
    const pricingPlans = await PricingPlan.find({ active: true })
      .sort({ order: 1 })
      .select("-__v");

    res.json({
      success: true,
      pricingPlans,
      message: "Pricing plans retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pricing plans",
      error: error.message,
    });
  }
});

// GET /api/pricing-plans/:id - Get a specific pricing plan
router.get("/:id", async (req, res) => {
  try {
    const pricingPlan = await PricingPlan.findById(req.params.id).select(
      "-__v"
    );

    if (!pricingPlan) {
      return res.status(404).json({
        success: false,
        message: "Pricing plan not found",
      });
    }

    res.json({
      success: true,
      pricingPlan,
      message: "Pricing plan retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching pricing plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pricing plan",
      error: error.message,
    });
  }
});

export default router;

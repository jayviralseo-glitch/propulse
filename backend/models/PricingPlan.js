import mongoose from "mongoose";

const pricingPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    monthlyPriceUsd: {
      type: Number,
      required: true,
      min: 0,
      // Support decimal values like 0.3, 1.5, 2.99
      validate: {
        validator: function (v) {
          return v >= 0 && Number.isFinite(v);
        },
        message:
          "Monthly price must be a valid positive number (supports decimals)",
      },
    },
    monthlyProposals: {
      type: Number,
      required: true,
      min: 0,
      // Only integer values allowed
      validate: {
        validator: function (v) {
          return v >= 0 && Number.isInteger(v);
        },
        message: "Monthly proposals must be a valid positive integer",
      },
    },

    popular: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },

    // Simple embedded features array
    features: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("PricingPlan", pricingPlanSchema);

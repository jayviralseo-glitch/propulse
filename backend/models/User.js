import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    profiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
      },
    ],
    availableProposals: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Subscription fields
    currentPlan: {
      type: String,
      default: null,
    },
    planStatus: {
      type: String,
      enum: ["inactive", "active", "cancelled", "expired"],
      default: "inactive",
    },
    planExpirationDate: {
      type: Date,
      default: null,
    },
    planPurchaseDate: {
      type: Date,
      default: null,
    },
    billingPeriod: {
      type: String,
      enum: ["monthly", "yearly"],
      default: null,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    subscriptionToken: {
      type: String,
      default: null,
    },
    nextBillingDate: {
      type: Date,
      default: null,
    },
    lastBillingDate: {
      type: Date,
      default: null,
    },
    billingFrequency: {
      type: String,
      enum: ["monthly", "yearly"],
      default: null,
    },
    recurringAmount: {
      type: Number,
      default: null,
    },
    completedBillingCycles: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

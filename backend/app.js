// app.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profiles.js";
import historyRoutes from "./routes/history.js";
import proposalRoutes from "./routes/proposals.js";
import templateRoutes from "./routes/templates.js";
import pricingRoutes from "./routes/pricing.js";
import paymentRoutes from "./routes/payments.js";

// Admin Routes
import adminUserRoutes from "./routes/admin/users.js";
import adminPricingRoutes from "./routes/admin/pricing.js";
import adminProposalRoutes from "./routes/admin/proposals.js";
import adminPaymentRoutes from "./routes/admin/payments.js";

// ----- Load env -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// If your .env is in the project root, change to `path.join(__dirname, "..", ".env")`
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;

// ----- DB -----
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/propulse";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ----- CORS -----
app.use(cors());


app.use(
  "/api/payments/notify",
  express.urlencoded({
    extended: false,
    verify: (req, _res, buf) => {
      // Save the exact wire string for signature calculation
      req.rawBody = buf.toString("utf8");
    },
  })
);

// ----- Generic parsers (safe for all other routes) -----
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true, // ok for normal forms elsewhere
  })
);

// ----- Routes -----
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/pricing-plans", pricingRoutes);
app.use("/api/payments", paymentRoutes);

// Admin Routes
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/pricing", adminPricingRoutes);
app.use("/api/admin/proposals", adminProposalRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);

// ----- Health check -----
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", message: "ProPulse Backend is running" });
});

// ----- Error handler -----
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong!", message: err.message });
});

// ----- 404 -----
app.use("*", (_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ----- Start -----
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

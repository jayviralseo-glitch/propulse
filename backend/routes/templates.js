import express from "express";
import ProposalTemplate from "../models/ProposalTemplate.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Get all active proposal templates
router.get("/", async (req, res) => {
  try {
    const templates = await ProposalTemplate.find({ isActive: true }).sort({
      order: 1,
    });
    res.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("Get templates error:", error);
    res.status(500).json({
      error: "Failed to get templates",
      message: error.message,
    });
  }
});

// Get template by ID
router.get("/:id", async (req, res) => {
  try {
    const template = await ProposalTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }
    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Get template error:", error);
    res.status(500).json({
      error: "Failed to get template",
      message: error.message,
    });
  }
});

// Create new template (admin only)
router.post("/", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const template = new ProposalTemplate(req.body);
    const savedTemplate = await template.save();

    res.status(201).json({
      success: true,
      template: savedTemplate,
    });
  } catch (error) {
    console.error("Create template error:", error);
    res.status(500).json({
      error: "Failed to create template",
      message: error.message,
    });
  }
});

// Update template (admin only)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const template = await ProposalTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Update template error:", error);
    res.status(500).json({
      error: "Failed to update template",
      message: error.message,
    });
  }
});

// Delete template (admin only)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const template = await ProposalTemplate.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Delete template error:", error);
    res.status(500).json({
      error: "Failed to delete template",
      message: error.message,
    });
  }
});

// Toggle template active status (admin only)
router.patch("/:id/toggle", authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const template = await ProposalTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    template.isActive = !template.isActive;
    await template.save();

    res.json({
      success: true,
      template,
      message: `Template ${
        template.isActive ? "activated" : "deactivated"
      } successfully`,
    });
  } catch (error) {
    console.error("Toggle template error:", error);
    res.status(500).json({
      error: "Failed to toggle template",
      message: error.message,
    });
  }
});

export default router;

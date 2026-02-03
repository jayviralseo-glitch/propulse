import express from "express";
import mongoose from "mongoose";
import { generateProposal } from "../services/openai.js";
import ProposalTemplate from "../models/ProposalTemplate.js";
import History from "../models/History.js";
import User from "../models/User.js";
import { authenticateToken, checkPlanExpiration } from "../middleware/auth.js";

const router = express.Router();

// Generate proposal from job description
router.post(
  "/generate",
  authenticateToken,
  checkPlanExpiration,
  async (req, res) => {
    try {
      const { jobDescription, templateId, profileId, proposalUrl } = req.body;

      // Basic checks
      if (
        !jobDescription ||
        typeof jobDescription !== "string" ||
        !jobDescription.trim()
      ) {
        return res.status(400).json({ error: "Job description is required" });
      }
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID is required" });
      }

      // User
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      if (user.planStatus !== "active") {
        return res.status(403).json({
          error: "Inactive plan",
          message:
            "You need an active subscription to generate proposals. Please upgrade your plan.",
        });
      }

      // Profile
      const Profile = mongoose.model("Profile");
      const profile = await Profile.findById(profileId);
      if (!profile) return res.status(404).json({ error: "Profile not found" });

      // Template (optional)
      let prompt = null;
      if (templateId) {
        const template = await ProposalTemplate.findById(templateId);
        if (template?.prompt) prompt = template.prompt;
      }

      // Atomically decrement quota if > 0
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.user.id, availableProposals: { $gt: 0 } },
        { $inc: { availableProposals: -1 } },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(403).json({
          error: "No proposals left",
          message:
            "You have no proposals remaining. Please upgrade your plan or wait for next billing cycle.",
        });
      }

      try {
        // Generate proposal
        const result = await generateProposal(jobDescription, prompt, profile);
        const proposal =
          typeof result === "string" ? result : result?.text || "";
        const meta =
          typeof result === "object" && result?.meta ? result.meta : {};

        // Save history
        const history = new History({
          userId: req.user.id,
          profileId,
          jobDescription,
          generatedProposal: proposal,
          proposalUrl,
          metadata: {
            tokensUsed: Number(meta.tokensUsed) || 0,
            generationTime: Date.now(),
            model: meta.model || "gpt-5",
          },
        });
        await history.save();

        // Respond
        return res.json({
          success: true,
          proposal,
          historyId: history._id,
          remainingProposals: updatedUser.availableProposals,
        });
      } catch (genErr) {
        // Restore quota if generation failed
        await User.updateOne(
          { _id: req.user.id },
          { $inc: { availableProposals: +1 } }
        );
        throw genErr;
      }
    } catch (error) {
      console.error("Generate proposal error:", error);
      return res.status(500).json({
        error: "Failed to generate proposal",
        message: error.message,
      });
    }
  }
);

export default router;

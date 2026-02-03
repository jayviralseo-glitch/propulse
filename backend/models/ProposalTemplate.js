import mongoose from "mongoose";

const proposalTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
      enum: [
        "FileText",
        "File",
        "Edit",
        "MessageSquare",
        "Send",
        "Target",
        "Lightbulb",
        "Search",
        "Briefcase",
        "Star",
        "User",
        "Users",
        "Settings",
        "Zap",
        "TrendingUp",
        "Award",
        "Heart",
        "Shield",
        "Globe",
        "Code",
        "Sparkles",
      ],
      default: "FileText",
    },
    prompt: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: [
        "cover-letter",
        "approach",
        "job-application",
        "simple",
        "questions",
        "estimate",
      ],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ProposalTemplate", proposalTemplateSchema);

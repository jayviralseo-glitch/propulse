import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    generatedProposal: {
      type: String,
      required: true,
    },
    metadata: {
      tokensUsed: Number,
      generationTime: Number,
      model: String,
    },
    proposalUrl: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("History", historySchema);

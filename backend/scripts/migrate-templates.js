import mongoose from "mongoose";
import dotenv from "dotenv";
import ProposalTemplate from "../models/ProposalTemplate.js";

dotenv.config();

const templates = [
  {
    name: "Professional Cover Letter",
    updatePrompt: (prompt) =>
      prompt
        .replace(
          /\n\n\*\*Formatting Requirements:\*\*[\s\S]*?Sign with the freelancer's actual name: \{firstName\} \{lastName\}/m,
          "",
        )
        .replace(
          /\n\n- Use proper paragraph breaks[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        ),
  },
  {
    name: "Strategic Approach",
    updatePrompt: (prompt) =>
      prompt
        .replace(
          /\n\n\*\*Formatting Requirements:\*\*[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        )
        .replace(
          /\n\n- Use proper paragraph breaks[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        ),
  },
  {
    name: "Job Application",
    updatePrompt: (prompt) =>
      prompt
        .replace(
          /\n\n\*\*Formatting Tips:\*\*[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        )
        .replace(
          /\n\n- Use bullet points[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        ),
  },
  {
    name: "Concise Proposal",
    updatePrompt: (prompt) =>
      prompt
        .replace(
          /\n\n\*\*Formatting:\*\*[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        )
        .replace(
          /\n\n- Keep it under 150 words[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        ),
  },
  {
    name: "Engaging Questions",
    updatePrompt: (prompt) =>
      prompt
        .replace(
          /\n\n\*\*Formatting:\*\*[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        )
        .replace(
          /\n\n- Use the questions[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        ),
  },
  {
    name: "Detailed Estimate",
    updatePrompt: (prompt) =>
      prompt
        .replace(
          /\n\n\*\*Formatting:\*\*[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        )
        .replace(
          /\n\n- Use clear headings[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        ),
  },
];

async function migrateTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    for (const template of templates) {
      const doc = await ProposalTemplate.findOne({ name: template.name });
      if (doc) {
        // Clean up the prompt
        let cleanedPrompt = doc.prompt;

        // Remove formatting guidelines sections
        cleanedPrompt = cleanedPrompt.replace(
          /\n\n\*\*Formatting(?:\s+Guidelines)?(?:\s+Requirements|Tips)?:\*\*[\s\S]*?(?=\n\nJob Description:|$)/m,
          "",
        );

        // Remove IMPORTANT notes about formatting
        cleanedPrompt = cleanedPrompt.replace(
          /\n\n- NO markdown formatting[\s\S]*?Always use the freelancer's real name, never use placeholders\./m,
          "",
        );

        // Remove repeated "Always use" instructions at the end
        cleanedPrompt = cleanedPrompt.replace(
          /\n\nAlways use the freelancer's real name, never use placeholders\.$/m,
          "",
        );

        // Update the template
        doc.prompt = cleanedPrompt.trim();
        await doc.save();
        console.log(`✅ Updated: ${template.name}`);
      }
    }

    console.log("\n✅ Migration completed successfully!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateTemplates();

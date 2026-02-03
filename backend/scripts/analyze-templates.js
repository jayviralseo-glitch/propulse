import mongoose from "mongoose";
import ProposalTemplate from "../models/ProposalTemplate.js";

// MongoDB connection
const MONGODB_URI = "mongodb+srv://digambermehta2603:FXGGJgWjQEQjilkU@cluster0.4tua84v.mongodb.net/propulse";

async function analyzeTemplates() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const templates = await ProposalTemplate.find({}).sort({ order: 1 });
    
    console.log(`\n📊 Analyzing ${templates.length} templates...\n`);

    templates.forEach((template, index) => {
      console.log(`📋 Template ${index + 1}: "${template.name}"`);
      console.log(`   🏷️  Category: ${template.category}`);
      console.log(`   📝 Description: ${template.description}`);
      console.log(`   📄 Full Prompt:`);
      console.log(`   ${template.prompt}`);
      console.log("\n" + "=" * 80 + "\n");
    });

    // Analyze template structure
    console.log("🔍 Template Analysis:");
    templates.forEach((template, index) => {
      const prompt = template.prompt;
      const hasPlaceholders = prompt.includes("{firstName}") || prompt.includes("{lastName}");
      const hasInstructions = prompt.includes("create") || prompt.includes("write");
      const hasFormatting = prompt.includes("format") || prompt.includes("structure");
      
      console.log(`\n${index + 1}. "${template.name}":`);
      console.log(`   ✅ Has placeholders: ${hasPlaceholders}`);
      console.log(`   ✅ Has instructions: ${hasInstructions}`);
      console.log(`   ✅ Has formatting: ${hasFormatting}`);
      console.log(`   📊 Prompt length: ${prompt.length} characters`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

analyzeTemplates();

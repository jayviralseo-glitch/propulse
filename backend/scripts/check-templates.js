import mongoose from "mongoose";
import ProposalTemplate from "../models/ProposalTemplate.js";

// MongoDB connection
const MONGODB_URI = "mongodb+srv://digambermehta2603:FXGGJgWjQEQjilkU@cluster0.4tua84v.mongodb.net/propulse";

async function checkTemplates() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch all templates
    console.log("\n📋 Fetching all proposal templates...");
    const templates = await ProposalTemplate.find({}).sort({ order: 1 });
    console.log(`✅ Found ${templates.length} templates in database`);

    if (templates.length === 0) {
      console.log("❌ No templates found in database");
      return;
    }

    console.log("\n📊 Template Summary:");
    console.log("=" * 60);
    
    templates.forEach((template, index) => {
      console.log(`\n${index + 1}. Template: "${template.name}"`);
      console.log(`   📝 Description: ${template.description}`);
      console.log(`   🏷️  Category: ${template.category}`);
      console.log(`   🎯 Icon: ${template.icon}`);
      console.log(`   ✅ Active: ${template.isActive}`);
      console.log(`   📄 Prompt Preview: ${template.prompt.substring(0, 100)}...`);
      console.log(`   📅 Created: ${template.createdAt}`);
      console.log(`   📅 Updated: ${template.updatedAt}`);
    });

    console.log("\n" + "=" * 60);
    console.log(`📊 Total Templates: ${templates.length}`);
    console.log(`✅ Active Templates: ${templates.filter(t => t.isActive).length}`);
    console.log(`❌ Inactive Templates: ${templates.filter(t => !t.isActive).length}`);

    // Group by category
    const categoryCount = {};
    templates.forEach(template => {
      categoryCount[template.category] = (categoryCount[template.category] || 0) + 1;
    });

    console.log("\n📊 Templates by Category:");
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} templates`);
    });

  } catch (error) {
    console.error("❌ Error checking templates:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the check
checkTemplates();

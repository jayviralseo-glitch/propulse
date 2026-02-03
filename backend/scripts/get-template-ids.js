import mongoose from "mongoose";
import ProposalTemplate from "../models/ProposalTemplate.js";

// MongoDB connection
const MONGODB_URI = "mongodb+srv://digambermehta2603:FXGGJgWjQEQjilkU@cluster0.4tua84v.mongodb.net/propulse";

async function getTemplateIds() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const templates = await ProposalTemplate.find({}).sort({ order: 1 });
    
    console.log("📋 Template IDs:");
    templates.forEach((template, index) => {
      console.log(`${index + 1}. "${template.name}" - ID: ${template._id}`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

getTemplateIds();

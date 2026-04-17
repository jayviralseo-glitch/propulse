import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Update prompts to be minimal - move repetitive instructions to system prompt
const promptUpdates = {
  "Professional Cover Letter": `Write a tailored cover letter for {firstName} {lastName}.

{Write exactly 2 short sentences that show you understand the client's main goal and constraints. Start sentence 1 with one relevant emoji.}

## Here is how I can help
{Create a numbered list of 3 practical actions you would take to deliver this project well. Each point must mention an outcome.}

## Why Work With Me
{Write one paragraph under 55 words introducing your relevant experience, strongest skill fit, and one measurable result.}

Please **message me on Upwork** so we can review scope, timeline, and next steps.

{Write a 3-line signature: full name, profession, and Upwork profile URL if available.}

Use job description: {jobDescription}`,

  "Strategic Approach": `Create a strategic proposal for {firstName} {lastName}.

{Write 2 direct sentences proving you understand the business goal, technical challenge, and success criteria.}

## Here is how I would approach your project
{Create a numbered list with 3 phases: Discovery, Execution, Delivery. Keep each point to one sentence with clear value.}

## Why this strategy works
{Create a numbered list of 3 reasons: relevant experience, risk reduction, and delivery efficiency. Include one measurable outcome in one item.}

## Next steps
{Create a numbered list of 3 next steps: kickoff input needed, timeline alignment, and communication cadence.}

Please **message me on Upwork** so I can provide a final implementation plan.

{Write a 3-line signature: full name, profession, and Upwork profile URL if available.}

Use job description: {jobDescription}`,

  "Job Application": `Write a strong job application for {firstName} {lastName}.

{Write exactly 2 sentences that show enthusiasm for the role and clear understanding of what the employer needs.}

## Why I am a strong fit
{Create a numbered list of 3-4 matched qualifications from the job description. Use specific examples and at least one quantified result.}

## Value I will bring
{Write one short paragraph describing work style, communication approach, and how you reduce delivery risk.}

## Next steps
{Write 2 concise sentences inviting an interview and proposing availability.}

{Write a 3-line signature: full name, profession, and Upwork profile URL if available.}

Use job description: {jobDescription}`,

  "Concise Proposal": `Write a concise high-impact proposal for {firstName} {lastName} in under 150 words.

{Write 1 sentence that directly reflects the client's core need.}

## My plan
{Create a numbered list of exactly 3 points: deliverable, method, and differentiator. Keep each point under 14 words.}

## Timeline and next step
{Write 2 short sentences: one with realistic timeline, one with CTA to message on Upwork.}

{Write a 3-line signature: full name, profession, and Upwork profile URL if available.}

Use job description: {jobDescription}`,

  "Engaging Questions": `Write an engaging question-led proposal for {firstName} {lastName}.

{Write 2 short sentences acknowledging the project and showing strategic curiosity.}

## Key questions to align scope
{Create a numbered list of 4 smart questions covering business goal, constraints, success metrics, and timeline/budget.}

## Why these questions matter
{Write one short paragraph explaining how these answers improve solution quality and reduce rework.}

## Next step
{Write 2 concise sentences inviting a discovery chat and stating what you will prepare.}

{Write a 3-line signature: full name, profession, and Upwork profile URL if available.}

Use job description: {jobDescription}`,

  "Detailed Estimate": `Write a detailed estimate proposal for {firstName} {lastName}.

{Write 2 short sentences summarizing project understanding and delivery objective.}

## Delivery plan
{Create a numbered list with 4 phases: Discovery, Build, QA/Launch, Support. For each phase include timeline and investment placeholders (X days, $X).}

## Investment summary
{Write one line with total timeline placeholder and total investment placeholder.}

## What is included
{Create a numbered list of 5 inclusions: deliverables, updates, testing, documentation, post-launch support.}

## Commercial terms
{Create a numbered list of 3 terms: payment schedule, change request policy, and support window.}

Please **message me on Upwork** and I will provide a final scope-backed estimate.

{Write a 3-line signature: full name, profession, and Upwork profile URL if available.}

Use job description: {jobDescription}`,
};

async function migrateTemplates() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const db = conn.connection.db;
    const collection = db.collection("proposaltemplates");

    for (const [name, newPrompt] of Object.entries(promptUpdates)) {
      const result = await collection.updateOne(
        { name },
        { $set: { prompt: newPrompt } },
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Updated: ${name}`);
      } else {
        console.log(`⚠️ Template not found: ${name}`);
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

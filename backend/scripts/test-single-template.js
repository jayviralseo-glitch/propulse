import mongoose from "mongoose";
import { generateProposal } from "../services/openai.js";
import ProposalTemplate from "../models/ProposalTemplate.js";

// MongoDB connection
const MONGODB_URI = "mongodb+srv://digambermehta2603:FXGGJgWjQEQjilkU@cluster0.4tua84v.mongodb.net/propulse";

// Dummy job description for testing
const dummyJobDescription = `
We are looking for a skilled React developer to build a modern e-commerce website. The project includes:

- Frontend development using React.js and Next.js
- Integration with payment gateways (Stripe, PayPal)
- Responsive design for mobile and desktop
- User authentication and authorization
- Shopping cart functionality
- Admin dashboard for product management
- SEO optimization

Requirements:
- 3+ years of React experience
- Experience with Next.js
- Knowledge of payment integration
- Strong understanding of modern JavaScript
- Experience with responsive design
- Good communication skills

Budget: $2000-5000
Timeline: 4-6 weeks
`;

// Dummy user profile for testing
const dummyProfile = {
  firstName: "John",
  lastName: "Smith",
  profession: "Full Stack Developer",
  skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "TypeScript"],
  description: "Experienced full-stack developer with 5+ years of experience building modern web applications. Specialized in React, Node.js, and cloud technologies.",
  employmentHistory: [
    {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc",
      duration: "2021-2023"
    },
    {
      title: "Full Stack Developer", 
      company: "StartupXYZ",
      duration: "2019-2021"
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services"
    },
    {
      name: "React Developer Certification",
      issuer: "Meta"
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform using React, Node.js, and MongoDB with payment integration"
    },
    {
      name: "Task Management App",
      description: "Developed a collaborative task management application with real-time updates using Socket.io"
    },
    {
      name: "Portfolio Website",
      description: "Created a responsive portfolio website with CMS integration and SEO optimization"
    }
  ]
};

async function testSingleTemplate(templateId) {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch the specific template
    console.log(`\n📋 Fetching template with ID: ${templateId}...`);
    const template = await ProposalTemplate.findById(templateId);
    
    if (!template) {
      console.log("❌ Template not found");
      return;
    }

    console.log(`✅ Found template: "${template.name}"`);
    console.log(`📝 Description: ${template.description}`);
    console.log(`🏷️  Category: ${template.category}`);
    console.log(`📄 Full Prompt: ${template.prompt}`);

    console.log("\n🤖 Generating proposal with OpenAI...");
    const startTime = Date.now();
    
    const proposal = await generateProposal(
      dummyJobDescription,
      template.prompt,
      dummyProfile
    );
    
    const endTime = Date.now();
    const generationTime = endTime - startTime;

    console.log("✅ Proposal generated successfully!");
    console.log(`⏱️  Generation time: ${generationTime}ms`);
    console.log(`📊 Proposal length: ${proposal.length} characters`);
    
    console.log("\n📝 Generated Proposal:");
    console.log("=" * 80);
    console.log(proposal);
    console.log("=" * 80);

    // Quality checks
    const checks = {
      containsName: proposal.toLowerCase().includes("john smith") || proposal.toLowerCase().includes("john"),
      containsSkills: dummyProfile.skills.some(skill => proposal.toLowerCase().includes(skill.toLowerCase())),
      containsProjects: dummyProfile.projects.some(project => proposal.toLowerCase().includes(project.name.toLowerCase())),
      hasReasonableLength: proposal.length > 200 && proposal.length < 2000,
      mentionsClient: proposal.toLowerCase().includes("client") || proposal.toLowerCase().includes("you"),
      followsTemplate: template.prompt.includes("{firstName}") ? proposal.includes("John") : true
    };

    console.log("\n🔍 Quality Checks:");
    console.log(`✅ Contains freelancer name: ${checks.containsName}`);
    console.log(`✅ Contains relevant skills: ${checks.containsSkills}`);
    console.log(`✅ Contains project experience: ${checks.containsProjects}`);
    console.log(`✅ Reasonable length: ${checks.hasReasonableLength}`);
    console.log(`✅ Mentions client: ${checks.mentionsClient}`);
    console.log(`✅ Follows template structure: ${checks.followsTemplate}`);

    const passedChecks = Object.values(checks).filter(Boolean).length;
    console.log(`📊 Quality Score: ${passedChecks}/${Object.keys(checks).length} checks passed`);

    if (passedChecks >= 4) {
      console.log("🎉 Template is working well!");
    } else {
      console.log("⚠️  Template may need improvement");
    }

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Get template ID from command line argument
const templateId = process.argv[2];

if (!templateId) {
  console.log("❌ Please provide a template ID");
  console.log("Usage: node test-single-template.js <template_id>");
  console.log("\nTo get template IDs, run: node scripts/check-templates.js");
  process.exit(1);
}

// Run the test
testSingleTemplate(templateId);

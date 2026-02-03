import mongoose from "mongoose";
import { generateProposal } from "../services/openai.js";
import ProposalTemplate from "../models/ProposalTemplate.js";
import fs from "fs";
import path from "path";

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

async function testAllTemplates() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Fetch all active templates
    console.log("\n📋 Fetching all templates...");
    const templates = await ProposalTemplate.find({ isActive: true }).sort({ order: 1 });
    console.log(`✅ Found ${templates.length} templates`);

    if (templates.length === 0) {
      console.log("❌ No templates found");
      return;
    }

    // Create output directory
    const outputDir = path.join(process.cwd(), "template-responses");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Test each template
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      console.log(`\n🧪 Testing Template ${i + 1}/${templates.length}: "${template.name}"`);

      try {
        console.log("🤖 Generating proposal...");
        const startTime = Date.now();
        
        const proposal = await generateProposal(
          dummyJobDescription,
          template.prompt,
          dummyProfile
        );
        
        const endTime = Date.now();
        const generationTime = endTime - startTime;

        console.log(`✅ Generated in ${generationTime}ms (${proposal.length} chars)`);

        // Save to file
        const fileName = `${template.name.replace(/[^a-zA-Z0-9]/g, '_')}_response.txt`;
        const filePath = path.join(outputDir, fileName);
        
        const content = `Template: ${template.name}
Category: ${template.category}
Description: ${template.description}
Generated: ${new Date().toISOString()}
Generation Time: ${generationTime}ms
Length: ${proposal.length} characters

${'='.repeat(80)}

${proposal}

${'='.repeat(80)}
`;

        fs.writeFileSync(filePath, content);
        console.log(`💾 Saved to: ${fileName}`);

      } catch (error) {
        console.error(`❌ Error with template "${template.name}":`, error.message);
        
        // Save error to file
        const fileName = `${template.name.replace(/[^a-zA-Z0-9]/g, '_')}_ERROR.txt`;
        const filePath = path.join(outputDir, fileName);
        const errorContent = `Template: ${template.name}
Error: ${error.message}
Time: ${new Date().toISOString()}
`;
        fs.writeFileSync(filePath, errorContent);
      }

      // Add delay between requests
      if (i < templates.length - 1) {
        console.log("⏳ Waiting 2 seconds...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log(`\n🎉 Testing completed!`);
    console.log(`📁 Responses saved in: ${outputDir}`);
    console.log(`📊 Tested ${templates.length} templates`);

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the test
testAllTemplates();

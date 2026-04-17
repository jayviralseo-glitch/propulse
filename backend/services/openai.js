import OpenAI from "openai";

let openai = null;

const getOpenAIClient = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

// Optional cleanup pass - keep markdown formatting intact
function formatProposalResponse(response) {
  if (!response) return response;
  let formatted = response;

  // Normalize excessive spacing only (keep markdown formatting)
  formatted = formatted.replace(/\n{4,}/g, "\n\n").trim();
  return formatted;
}

export const generateProposal = async (
  jobDescription,
  templatePrompt,
  profile = null,
) => {
  try {
    const client = getOpenAIClient();

    const fullName = profile
      ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
      : "The Freelancer";
    const upworkProfileUrl = profile?.upworkProfileId
      ? `https://www.upwork.com/freelancers/${profile.upworkProfileId}`
      : "Not provided";

    // Replace template placeholders with actual values
    let processedTemplate = templatePrompt
      .replace(/\{firstName\}/g, profile?.firstName || "The")
      .replace(/\{lastName\}/g, profile?.lastName || "Freelancer")
      .replace(/\{jobDescription\}/g, jobDescription)
      .replace(/\{profession\}/g, profile?.profession || "N/A")
      .replace(/\{skills\}/g, profile?.skills?.join(", ") || "N/A")
      .replace(/\{description\}/g, profile?.description || "N/A")
      .replace(
        /\{projects\}/g,
        profile?.projects?.length
          ? profile.projects
              .map((p) => `${p.name}: ${p.description}`)
              .join(" | ")
          : "No specific projects listed",
      );

    // Build the final prompt using the template structure
    const prompt = `You are ${fullName}. Follow this template structure exactly:

${processedTemplate}

Profile Information:
- Name: ${fullName}
- Profession: ${profile?.profession || "N/A"}
- Skills: ${profile?.skills?.join(", ") || "N/A"}
- Experience: ${profile?.description || "N/A"}
- Upwork Profile URL: ${upworkProfileUrl}
- Projects: ${
      profile?.projects?.length
        ? profile.projects.map((p) => `${p.name}: ${p.description}`).join(" | ")
        : "No specific projects listed"
    }

Job Description:
${jobDescription}`;

    // System prompt with all common guidelines
    const systemPrompt = `You are a concise, expert proposal writer specializing in high-conversion Upwork proposals.

CORE INSTRUCTIONS:
- Write in FIRST PERSON as the freelancer (use "I", "my", "me")
- Always use the freelancer's real name (never placeholders)
- All names have been replaced before reaching you - use them as provided
- Focus on content ready to paste directly into proposals

MARKDOWN FORMATTING:
- Use **bold** to highlight important terms, skills, achievements, and differentiators
- Use *italic* for emphasis, nuance, and client-focused language
- Use ONLY NUMERIC LISTS (1., 2., 3., 4., etc.) - NEVER use bullet points
  - Numeric lists: Use for steps, phases, benefits, requirements, deliverables
  - Keep paragraphs short and punchy (2-3 sentences max)
- Use emoji and icons LIBERALLY:
  - ✅ for completed tasks/achievements
  - 🎯 for goals or focus areas
  - 💡 for ideas or insights
  - ⚡ for speed/efficiency
  - 🚀 for growth or success
  - 📊 for data/metrics
  - 🔒 for security/reliability
  - 👥 for team/collaboration
  - ✨ for quality/excellence
  - 🛠️ for tools/implementation
  - Add emoji at the start of key sentences or list items to make content scannable

CONTENT STYLE:
- Keep language direct and action-oriented
- Highlight **quantifiable results** and **specific achievements**
- Emphasize *client benefits* over features
- Break complex ideas into simple, digestible pieces
- Include a clear CTA near the end asking client to message on Upwork
- If Upwork Profile URL is provided, include it in the signature block; otherwise skip the URL line

OUTPUT REQUIREMENTS:
- Always return markdown-formatted content
- Preserve all **bold**, *italic*, and formatting
- Use proper spacing between sections
- NUMERIC lists ONLY with clear numbering (1., 2., 3., etc.)
- Use emoji liberally for visual interest and scannability
- Make important information visually distinct using markdown and emoji
- Sign with the provided freelancer name
- No generic placeholders or examples in final output`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 900,
      temperature: 0.7,
    });

    let proposal = completion.choices[0].message.content || "";
    proposal = formatProposalResponse(proposal);

    // Append "Related Projects" section if user has projects
    if (profile?.projects && profile.projects.length > 0) {
      proposal += "\n\n## Related Projects\n\n";
      profile.projects.forEach((project, index) => {
        const skills = project.skills?.length
          ? ` | *${project.skills.join(", ")}*`
          : "";
        proposal += `${index + 1}. **${project.name}**${skills}\n${project.description || "Project completed"}\n\n`;
      });
    }

    return proposal;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate proposal");
  }
};

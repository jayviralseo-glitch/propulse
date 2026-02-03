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

// Optional cleanup pass (but minimal, since we don't want AI to send labels)
function formatProposalResponse(response) {
  if (!response) return response;
  let formatted = response;

  // Remove markdown symbols
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, "$1");
  formatted = formatted.replace(/\*(.*?)\*/g, "$1");
  formatted = formatted.replace(/`(.*?)`/g, "$1");
  formatted = formatted.replace(/#{1,6}\s/g, "");

  // Normalize spacing
  formatted = formatted.replace(/\n{3,}/g, "\n\n").trim();
  return formatted;
}

export const generateProposal = async (jobDescription, templatePrompt, profile = null) => {
  try {
    const client = getOpenAIClient();

    const fullName = profile
      ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
      : "The Freelancer";

    // Replace template placeholders with actual values
    let processedTemplate = templatePrompt
      .replace(/\{firstName\}/g, profile?.firstName || "The")
      .replace(/\{lastName\}/g, profile?.lastName || "Freelancer")
      .replace(/\{jobDescription\}/g, jobDescription)
      .replace(/\{profession\}/g, profile?.profession || "N/A")
      .replace(/\{skills\}/g, profile?.skills?.join(", ") || "N/A")
      .replace(/\{description\}/g, profile?.description || "N/A")
      .replace(/\{projects\}/g, profile?.projects?.length
        ? profile.projects.map((p) => `${p.name}: ${p.description}`).join(" | ")
        : "No specific projects listed");

    // Build the final prompt using the template structure
    const prompt = `
    You are ${fullName}, writing a professional proposal in FIRST PERSON (use "I", "my", "me" - never third person like "${fullName} understands" or "${fullName} will").
    
    Follow the template structure EXACTLY as specified below. Do not deviate from the format.
    
    ${processedTemplate}
    
    CRITICAL INSTRUCTIONS:
    - Write in FIRST PERSON as ${fullName} speaking directly to the client
    - Use "I understand", "I will deliver", "My approach" - NOT "${fullName} understands"
    - Follow the template structure precisely with exact format and sections
    - Write as if you ARE ${fullName}, not ABOUT ${fullName}
    - DO NOT include section headings like "Opening Statement:", "Why I'm Perfect:", "My Solution:" etc. in the final text
    - The headings in the template are just instructions for you - do not write them in the proposal
    - Write the content directly without any section headers
    `;
    
    

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a concise, expert proposal writer. Always return clean proposals with no labels or markdown.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const proposal = completion.choices[0].message.content || "";
    return formatProposalResponse(proposal);
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate proposal");
  }
};

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeClaim(item, claim) {
  const prompt = `
You are an expert lost-and-found verification assistant.

Compare the LOST ITEM and the CLAIM.

LOST ITEM

Title:
${item.title}

Description:
${item.description}

Secret Mark:
${item.secretMark}

Location:
${item.location}

--------------------------------

CLAIM

Reason:
${claim.reason}

Claim Proof:
${claim.claimantProof}

Return ONLY valid JSON.
Do not use markdown.
Do not use triple backticks.
Do not include any explanation outside the JSON.

{
  "score": number,
  "recommendation": "Likely Owner" | "Possible Match" | "Needs Verification",
  "reason": "short explanation"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let text = response.text.trim();

text = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

return JSON.parse(text);
}

module.exports = analyzeClaim;
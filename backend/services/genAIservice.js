const axios = require("axios");

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

// Function to interact with Gemini API and generate hashtags
const generateHashtags = async (userInput) => {
  try {
    const prompt = `
Generate exactly ${userInput.count} popular and creative hashtags 
for a ${userInput.postType} on ${userInput.platform}.
Topic: ${userInput.topic}.
Vibe: ${userInput.vibe}.
${userInput.location ? `Location: ${userInput.location}.` : ""}
${userInput.description ? `Description: ${userInput.description}.` : ""}
Only return a comma-separated list of hashtags, no extra text.
`;

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Raw Gemini Response:", JSON.stringify(response.data, null, 2));

    const candidate = response.data.candidates?.[0];
    const textResponse = candidate?.content?.parts?.[0]?.text || "";

    const hashtags = textResponse
      .replace(/\n/g, "")
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.startsWith("#"));

    // console.log("hashtags generated are : ",hashtags);
    return hashtags;
  } catch (error) {
    console.error("Gemini API Error:", error?.response?.data || error.message);
    throw new Error("Failed to generate hashtags");
  }
};

module.exports = generateHashtags;

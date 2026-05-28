export default async function handler(req, res) {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    // Check API key exists
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GROQ_API_KEY missing in Vercel",
      });
    }

    // Send request to Groq
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(req.body),
      },
    );

    // Parse response
    const data = await groqResponse.json();

    // If Groq itself failed
    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json(data);
    }

    // Success
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}

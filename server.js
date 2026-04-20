import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors({ origin: "https://nawerni.vercel.app" }));
app.use(express.json());

app.post("/api/ai-suggestion", async (req, res) => {
  const { prompt } = req.body;
  console.log("📥 Received prompt:", prompt);
  console.log("🔑 API Key loaded:", process.env.ANTHROPIC_API_KEY ? "YES" : "NO");

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    console.log("📤 Anthropic response:", JSON.stringify(data, null, 2));

    res.json({ suggestion: data.content?.[0]?.text || "No suggestion available." });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ suggestion: "Error contacting AI." });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
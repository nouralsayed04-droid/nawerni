import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.options("*", cors({ origin: "https://nawerni.vercel.app" }));
app.use(cors({ origin: "https://nawerni.vercel.app" }));
app.use(express.json({ limit: "10mb" })); // ✅ increased limit for images

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
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    res.json({ suggestion: data.content?.[0]?.text || "No suggestion available." });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ suggestion: "Error contacting AI." });
  }
});

// ✅ NEW: Scan endpoint for reading product images
app.post("/api/scan", async (req, res) => {
  const { imageBase64, mediaType } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType || "image/jpeg",
                  data: imageBase64
                }
              },
              {
                type: "text",
                text: `Look at this product image and extract the following information. Respond ONLY with a JSON object, no extra text:
{
  "productName": "the product name or brand you can see",
  "expiryDate": "expiry date in YYYY-MM-DD format, or empty string if not found",
  "barcode": "barcode number if visible, or empty string if not found"
}
If you cannot find any information, use empty strings. Only return the JSON object.`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);
  } catch (err) {
    console.error("❌ Scan error:", err);
    res.status(500).json({ productName: "", expiryDate: "", barcode: "" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
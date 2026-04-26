export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { imageBase64, mediaType } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Look at this product image and extract:
1. Product name
2. Expiry date (in YYYY-MM-DD format if possible)
3. Barcode number if visible

Respond ONLY in this exact JSON format with no extra text:
{"productName": "...", "expiryDate": "...", "barcode": "..."}

If you cannot find a value, use an empty string "".`,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  try {
    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch {
    res.status(200).json({ productName: "", expiryDate: "", barcode: "" });
  }
}
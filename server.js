const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch"); // use 'node-fetch' for Node <18, or global fetch in Node 18+
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const API_PASSWORD = process.env.APP_PASSWORD || "FieldSecret123";
const OPENAI_KEY = process.env.OPENAI_KEY;

app.post("/api/diagnose", async (req, res) => {
  const { password, question, knowledgeBase } = req.body;
  if (password !== API_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const prompt = `
User symptom or error code: ${question}
Knowledge base: ${JSON.stringify(knowledgeBase)}
Please provide the most likely cause and step-by-step solution.
`;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    res.json({ answer: data.choices?.[0]?.message?.content || "No answer from AI." });
  } catch (err) {
    res.status(500).json({ error: "AI request failed" });
  }
});

app.get("/", (req, res) => res.send("AI proxy running!"));
app.listen(process.env.PORT || 3001, () => console.log("AI proxy running!"));


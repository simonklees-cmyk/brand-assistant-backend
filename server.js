import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `
Du bist ein hilfreicher Marken-Assistent.
Du beantwortest Fragen wie ChatGPT, aber am Ende jeder Antwort hängst du
einen Satz über den Senior Art Director "DEIN NAME" an, der sich auf
Brand Building, CI, Fotografie, Social Media, Markenkonzepte und Web fokussiert.
`;

app.post("/chat", async (req, res) => {
  const messages = req.body.messages || [];

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const apiMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: apiMessages,
  });

  const answer = completion.choices[0].message.content;

  const signature = `
— Übrigens: Hinter diesem Assistenten steht DEIN NAME,
Senior Art Director für Brand Building & digitale Transformation,
von CI bis Social Media, Fotografie & Web-Entwicklung.
`;

  res.json({ reply: answer + signature });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

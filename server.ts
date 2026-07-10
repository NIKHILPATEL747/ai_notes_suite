import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Lazy-loaded Gemini API Client to prevent crash on startup if key is missing
let aiClient: any = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/generate-notes", async (req, res) => {
    try {
      const { topic, subject, gradeLevel, style } = req.body;

      if (!topic) {
        return res.status(400).json({ error: "Input topic or study material is required." });
      }

      const ai = getGeminiClient();

      const userPrompt = `
Generate comprehensive academic study notes and resources.
Subject: ${subject || "General Study"}
Grade Level / Education Level: ${gradeLevel || "High School"}
Study Style / Focus: ${style || "Standard Study Guide"}

User Topic/Materials Input:
"""
${topic}
"""

Please construct highly organized notes. Use academic, informative, and engaging language appropriate for ${gradeLevel}.
`;

      const systemInstruction = `You are an elite, world-class academic tutor and learning specialist. 
Your task is to take student topic inputs or transcripts and output highly detailed, beautifully structured, and incredibly useful study materials.
You must adapt your explanations to the specified Grade Level.
Generate sections with thorough, clear paragraphs (narrative content) alongside quick bullet points of key details.
Create a list of key vocabulary concepts.
Create a Cornell Notes column structure.
Create an interactive set of flashcards.
Create a practice quiz of 5 questions with options and explanations.
Build a hierarchical mind-map node structure with a main root node and child nodes so we can visualize a tree diagram of the concepts.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "A highly clear, engaging, and professional academic title for this set of notes."
          },
          summary: {
            type: Type.STRING,
            description: "A 2-3 sentence overview providing context and summarization of the topic."
          },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING, description: "Clear sub-section heading." },
                content: { type: Type.STRING, description: "A detailed, robust, and deep explanation paragraph (at least 3-4 sentences)." },
                bulletPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3-5 critical bulleted facts, equations, or examples for this section."
                }
              },
              required: ["heading", "content", "bulletPoints"]
            },
            description: "3 to 5 comprehensive sections dividing the core material."
          },
          keyConcepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING, description: "A critical key vocabulary word, formula, or figure." },
                definition: { type: Type.STRING, description: "An accurate and clear academic definition or historical significance." }
              },
              required: ["term", "definition"]
            },
            description: "6 to 10 vocabulary terms/core definitions."
          },
          cornellNotes: {
            type: Type.OBJECT,
            properties: {
              cueColumn: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "5 high-level review questions, cues, or memory triggers written on the left side of Cornell Notes."
              },
              notesColumn: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Corresponding direct detailed answers, formulas, or notes written on the right side of Cornell Notes matching each item in cueColumn."
              },
              summaryColumn: {
                type: Type.STRING,
                description: "A final 2-3 sentence review summary mapping out the main takeaways of the entire page."
              }
            },
            required: ["cueColumn", "notesColumn", "summaryColumn"]
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING, description: "A question, concept term, or prompt on the front of the flashcard." },
                back: { type: Type.STRING, description: "The solution, detailed answer, or explanation on the back of the flashcard." }
              },
              required: ["front", "back"]
            },
            description: "6 to 10 active recall flashcards."
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "A highly clear multiple choice question testing comprehension." },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 distinct answers (only one of which is correct)."
                },
                correctAnswer: { type: Type.STRING, description: "The correct answer option, which must match exactly one of the options elements." },
                explanation: { type: Type.STRING, description: "A thorough academic explanation of why this answer is correct and others are incorrect." }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            },
            description: "Exactly 5 multiple-choice questions."
          },
          mindMapNodes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "A short unique identifier string, e.g. 'root', 'm1', 'm2'." },
                label: { type: Type.STRING, description: "Short textual label, e.g. 'Mitochondria'." },
                parentId: { type: Type.STRING, description: "The id of the parent node. Root node parentId should be 'root' or empty.", nullable: true },
                description: { type: Type.STRING, description: "A short, engaging definition or detailed takeaway (10-15 words)." }
              },
              required: ["id", "label", "description"]
            },
            description: "A tree structure for a mindmap. The first item must be the root (parentId: null). Subnodes must correctly specify their parentId."
          }
        },
        required: ["title", "summary", "sections", "keyConcepts", "cornellNotes", "flashcards", "quiz", "mindMapNodes"]
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema
        }
      });

      if (!response.text) {
        throw new Error("No response text received from the Gemini AI model.");
      }

      const generatedData = JSON.parse(response.text.trim());
      res.json({ success: true, data: generatedData });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: error.message || "An error occurred during AI notes generation." });
    }
  });

  // Serve static assets & routing fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Notes Generator server running on http://localhost:${PORT}`);
  });
}

startServer();

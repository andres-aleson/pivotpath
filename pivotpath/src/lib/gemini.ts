import { GoogleGenAI } from "@google/genai";

const globalForGemini = globalThis as unknown as {
  gemini: GoogleGenAI | undefined;
};

export const gemini = globalForGemini.gemini ?? new GoogleGenAI({});

if (process.env.NODE_ENV !== "production") {
  globalForGemini.gemini = gemini;
}

// Free-tier Flash model — check https://ai.google.dev for the current default.
export const GEMINI_MODEL = "gemini-3.6-flash";

import { GoogleGenAI } from "@google/genai";

const globalForGemini = globalThis as unknown as {
  gemini: GoogleGenAI | undefined;
};

// One quick retry for blips; the model fallback below handles real outages.
export const gemini =
  globalForGemini.gemini ??
  new GoogleGenAI({ httpOptions: { retryOptions: { attempts: 2 } } });

if (process.env.NODE_ENV !== "production") {
  globalForGemini.gemini = gemini;
}

// Tried in order. Free-tier keys get a separate (small) daily allowance per
// model, so when one runs out or is overloaded the next one takes over.
export const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.6-flash",
];

function statusOf(err: unknown): number | undefined {
  return (err as { status?: number } | null)?.status;
}

// Quota exhausted, overloaded, server error, or model not available.
function shouldTryNextModel(err: unknown): boolean {
  const status = statusOf(err);
  return status === 429 || status === 503 || status === 500 || status === 404;
}

export async function withModelFallback<T>(run: (model: string) => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (const model of GEMINI_MODELS) {
    try {
      return await run(model);
    } catch (err) {
      lastError = err;
      if (!shouldTryNextModel(err)) throw err;
      console.warn(`Gemini model ${model} unavailable (status ${statusOf(err)}); trying the next one.`);
    }
  }
  throw lastError;
}

export function aiFailureMessage(err: unknown, fallback: string): string {
  const status = statusOf(err);
  if (status === 429) {
    return "Our AI has reached its usage limit for now. Please try again in a little while.";
  }
  if (status === 503) {
    return "The AI service is busy right now. Please try again in a moment.";
  }
  return fallback;
}

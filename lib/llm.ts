// Server-side LLM client. Primary provider: Gemini (key works on gemini-2.5-flash-lite).
// Returns parsed JSON or null on any failure — callers MUST have a deterministic fallback.

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

export const llmEnabled = Boolean(GEMINI_KEY);

export async function llmJSON<T>(prompt: string): Promise<T | null> {
  if (!GEMINI_KEY) return null;
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, responseMimeType: "application/json" },
          }),
          // keep server route responsive
          signal: AbortSignal.timeout(28000),
        },
      );
      if (!res.ok) continue;
      const data = await res.json();
      const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) continue;
      return JSON.parse(text) as T;
    } catch {
      continue;
    }
  }
  return null;
}

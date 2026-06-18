// Server-side LLM client. Primary: OpenAI GPT (gpt-4o-mini, cheap). Fallback: Gemini.
// Returns parsed JSON or null on any failure — callers MUST have a deterministic fallback.

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];

export const llmEnabled = Boolean(OPENAI_KEY || GEMINI_KEY);

async function openaiJSON<T>(prompt: string): Promise<T | null> {
  if (!OPENAI_KEY) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: "gpt-4o-mini", // cheap, fast — minimal cost
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4,
        max_tokens: 1500,
      }),
      signal: AbortSignal.timeout(28000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

async function geminiJSON<T>(prompt: string): Promise<T | null> {
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

export async function llmJSON<T>(prompt: string): Promise<T | null> {
  return (await openaiJSON<T>(prompt)) ?? (await geminiJSON<T>(prompt));
}

// ament — Anthropic LLM client
// All synthesis calls go through this module.
// Model is configured via ANTHROPIC_MODEL env var — change without touching code.

import Anthropic from "@anthropic-ai/sdk";

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing ANTHROPIC_API_KEY. Add it to your .env.local file."
    );
  }
  return new Anthropic({ apiKey });
}

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
}

// Token budget per lens — controls cost and response size.
// Raise these if answers feel truncated; lower to reduce cost.
export const TOKEN_BUDGETS = {
  themeExtraction: 200,  // just a JSON array of tags
  mirror: 600,           // ~400 words + citations
  seam: 250,             // 2–4 sentences
  essay: 2500,           // 800–1500 words
  inheritance: 1800,     // 600–1000 words
  decisionMemory: 500,   // 150–300 words
};

// Core call — used by all lenses.
export async function complete(
  prompt: string,
  maxTokens: number
): Promise<string> {
  const client = getClient();
  const model = getModel();

  const message = await client.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  const block = message.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response type from Anthropic API");
  }

  return block.text;
}

// Streaming version — used for Mirror (shows answer as it arrives).
export async function completeStream(
  prompt: string,
  maxTokens: number,
  onChunk: (text: string) => void
): Promise<string> {
  const client = getClient();
  const model = getModel();

  let fullText = "";

  const stream = await client.messages.stream({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      fullText += chunk.delta.text;
      onChunk(chunk.delta.text);
    }
  }

  return fullText;
}

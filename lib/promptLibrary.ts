// ament — eliciting prompt library
// These are the questions that invite members to deposit thought.
// EDIT THESE to change what questions the system suggests to members.
// Add new prompts here; they'll appear in the UI automatically.
//
// Categories: "strategy" | "culture" | "identity" | "risk" | "people" | "reflection"

export interface LibraryPrompt {
  text: string;
  category: string;
}

export const GLOBAL_PROMPTS: LibraryPrompt[] = [
  // ── Strategy ──────────────────────────────────────────────────────────────
  {
    text: "What does the organisation believe about its primary advantage — and do you share that belief?",
    category: "strategy",
  },
  {
    text: "Where do you think the organisation is wrong about the market? What are we missing?",
    category: "strategy",
  },
  {
    text: "What would you do differently if you were starting over today?",
    category: "strategy",
  },
  {
    text: "What is the most important thing we have not yet decided?",
    category: "strategy",
  },
  {
    text: "What is the one assumption our strategy rests on that keeps you up at night?",
    category: "strategy",
  },

  // ── Culture ───────────────────────────────────────────────────────────────
  {
    text: "What does it actually mean to do good work here — not what the values doc says, but what you've observed?",
    category: "culture",
  },
  {
    text: "What is the most common failure mode you see in how we collaborate?",
    category: "culture",
  },
  {
    text: "What conversation do we keep not having that we should?",
    category: "culture",
  },
  {
    text: "What does this organisation reward that it says it doesn't, and vice versa?",
    category: "culture",
  },

  // ── Identity ──────────────────────────────────────────────────────────────
  {
    text: "What makes this organisation different from the others you've worked in?",
    category: "identity",
  },
  {
    text: "If the organisation were a person, what would its characteristic flaw be?",
    category: "identity",
  },
  {
    text: "What story does the organisation tell about itself that you find partially untrue?",
    category: "identity",
  },
  {
    text: "What are we proud of that we rarely say aloud?",
    category: "identity",
  },

  // ── Risk ──────────────────────────────────────────────────────────────────
  {
    text: "What is the risk we keep underpricing? What are we systematically too optimistic about?",
    category: "risk",
  },
  {
    text: "What decision made in the last year are you most uncertain about now?",
    category: "risk",
  },
  {
    text: "If this organisation fails, what will have been the reason?",
    category: "risk",
  },

  // ── People ────────────────────────────────────────────────────────────────
  {
    text: "What kind of person thrives here, and what kind doesn't — and is that right?",
    category: "people",
  },
  {
    text: "What do you wish you'd known in your first three months here?",
    category: "people",
  },
  {
    text: "What are the unwritten rules that actually govern behaviour here?",
    category: "people",
  },

  // ── Reflection ────────────────────────────────────────────────────────────
  {
    text: "What has changed in how you think about the work over the past year?",
    category: "reflection",
  },
  {
    text: "What question has this quarter raised that you don't yet have an answer to?",
    category: "reflection",
  },
  {
    text: "What do you believe about this organisation that others here seem not to?",
    category: "reflection",
  },
];

// Seed these prompts into the database on first setup.
// Call this from the seed script.
export function getGlobalPrompts(): LibraryPrompt[] {
  return GLOBAL_PROMPTS;
}

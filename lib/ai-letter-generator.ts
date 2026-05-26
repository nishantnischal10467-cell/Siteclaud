export type LetterType =
  | "cover-letter"
  | "business-letter"
  | "thank-you-letter"
  | "apology-letter"
  | "recommendation-letter"
  | "resignation-letter"
  | "complaint-letter"
  | "invitation-letter"
  | "sales-letter"
  | "personal-letter"
  | "other";

export type LetterTone =
  | "approachable"
  | "authoritative"
  | "casual"
  | "enthusiastic"
  | "excited"
  | "formal"
  | "friendly"
  | "funny"
  | "informal"
  | "innovative"
  | "inspirational"
  | "neutral"
  | "optimistic"
  | "persuasive"
  | "pessimistic"
  | "professional"
  | "thoughtful";

export type LetterGeneratorInput = {
  type: LetterType;
  description: string;
  sender: string;
  recipient: string;
  language: string;
  tone: LetterTone;
};

export type LetterGeneratorResult = {
  title: string;
  letter: string;
  notes: string[];
  type: LetterType;
  language: string;
  tone: LetterTone;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

const typeLabels: Record<LetterType, string> = {
  "cover-letter": "Cover Letter",
  "business-letter": "Business Letter",
  "thank-you-letter": "Thank You Letter",
  "apology-letter": "Apology Letter",
  "recommendation-letter": "Recommendation Letter",
  "resignation-letter": "Resignation Letter",
  "complaint-letter": "Complaint Letter",
  "invitation-letter": "Invitation Letter",
  "sales-letter": "Sales Letter",
  "personal-letter": "Personal Letter",
  other: "Letter",
};

const toneGuidance: Record<LetterTone, string> = {
  approachable: "clear, warm, and easy to read",
  authoritative: "confident, direct, and credible",
  casual: "relaxed and conversational",
  enthusiastic: "positive and energetic",
  excited: "high-energy and appreciative",
  formal: "polished, respectful, and precise",
  friendly: "warm, helpful, and personable",
  funny: "light and memorable while staying appropriate",
  informal: "simple, natural, and direct",
  innovative: "fresh, forward-looking, and constructive",
  inspirational: "encouraging and motivating",
  neutral: "balanced and concise",
  optimistic: "positive and reassuring",
  persuasive: "benefit-led and action-oriented",
  pessimistic: "careful, risk-aware, and measured",
  professional: "clear, useful, and business-ready",
  thoughtful: "careful, nuanced, and considerate",
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function displayName(value: string, fallback: string) {
  return clean(value) || fallback;
}

function subjectFor(type: LetterType, description: string) {
  const label = typeLabels[type];
  const compact = clean(description);
  if (!compact) return label;
  const topic = compact.length > 58 ? `${compact.slice(0, 55).trim()}...` : compact;
  return `${label}: ${topic}`;
}

function intentSentence(type: LetterType) {
  const intents: Record<LetterType, string> = {
    "cover-letter": "I am writing to express my interest and explain why my experience is a strong fit.",
    "business-letter": "I am writing to share the relevant details and propose a clear next step.",
    "thank-you-letter": "I am writing to express my sincere appreciation.",
    "apology-letter": "I am writing to acknowledge the situation and offer a sincere apology.",
    "recommendation-letter": "I am writing to provide a thoughtful recommendation based on the relevant strengths and context.",
    "resignation-letter": "I am writing to formally communicate my decision and support a smooth transition.",
    "complaint-letter": "I am writing to explain the concern clearly and request a fair resolution.",
    "invitation-letter": "I am writing to warmly invite you and share the important details.",
    "sales-letter": "I am writing to introduce an opportunity and explain why it may be valuable.",
    "personal-letter": "I am writing to share this message in a personal and considerate way.",
    other: "I am writing to share the details clearly and respectfully.",
  };
  return intents[type];
}

export function generateAiLetter(input: LetterGeneratorInput): LetterGeneratorResult {
  const description = clean(input.description);

  if (!description) {
    throw new Error("Add a letter description before generating.");
  }

  const sender = displayName(input.sender, "Your Name");
  const recipient = displayName(input.recipient, "Recipient");
  const title = subjectFor(input.type, description);
  const tone = toneGuidance[input.tone];
  const letter = [
    title,
    "",
    `Dear ${recipient},`,
    "",
    intentSentence(input.type),
    "",
    `Here is the main context: ${description}`,
    "",
    `I wanted to communicate this in a ${tone} way while keeping the message practical, respectful, and easy to act on. The most important point is to make the purpose clear, provide enough context, and close with an appropriate next step.`,
    "",
    "Please let me know if you would like any additional details or if there is a better time to discuss this further.",
    "",
    "Sincerely,",
    sender,
  ].join("\n");
  const notes = [
    `Structured as a ${typeLabels[input.type].toLowerCase()}.`,
    `Uses a ${input.tone} tone in ${input.language}.`,
    "Includes a clear opening, context paragraph, next step, and closing.",
  ];
  const words = letter.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = letter.length;

  return {
    title,
    letter,
    notes,
    type: input.type,
    language: input.language,
    tone: input.tone,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
  };
}

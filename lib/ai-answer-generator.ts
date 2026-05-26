export type AnswerTone =
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

export type AnswerGeneratorInput = {
  question: string;
  language: string;
  tone: AnswerTone;
};

export type AnswerGeneratorResult = {
  question: string;
  answer: string;
  keyPoints: string[];
  followUps: string[];
  language: string;
  tone: AnswerTone;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

const toneGuidance: Record<AnswerTone, string> = {
  approachable: "clear, welcoming, and easy to understand",
  authoritative: "confident, precise, and grounded",
  casual: "relaxed and conversational",
  enthusiastic: "upbeat and energetic",
  excited: "high-energy and motivating",
  formal: "polished and respectful",
  friendly: "warm and helpful",
  funny: "light and memorable while staying useful",
  informal: "simple and natural",
  innovative: "fresh, strategic, and forward-looking",
  inspirational: "encouraging and motivating",
  neutral: "balanced and direct",
  optimistic: "positive and reassuring",
  persuasive: "benefit-led and convincing",
  pessimistic: "cautious and risk-aware",
  professional: "clear, credible, and business-ready",
  thoughtful: "careful, nuanced, and considerate",
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function topicFromQuestion(question: string) {
  return clean(question)
    .replace(/^(what|why|how|when|where|who|can|could|should|is|are|do|does|did)\b\s*/i, "")
    .replace(/[?!.]+$/, "")
    .trim() || "this topic";
}

function classifyQuestion(question: string) {
  const normalized = question.toLowerCase();
  if (normalized.startsWith("how")) return "process";
  if (normalized.startsWith("why")) return "reasoning";
  if (normalized.startsWith("what")) return "definition";
  if (normalized.startsWith("when")) return "timing";
  if (normalized.startsWith("can") || normalized.startsWith("could") || normalized.startsWith("should")) return "recommendation";
  return "general";
}

function makeKeyPoints(question: string) {
  const topic = topicFromQuestion(question);
  const type = classifyQuestion(question);

  if (type === "process") {
    return [
      `Start by defining the desired outcome for ${topic}.`,
      "Break the work into clear steps and validate each step before moving on.",
      "Use examples or constraints when the answer needs to be applied in a real workflow.",
    ];
  }

  if (type === "reasoning") {
    return [
      `${topic} usually depends on context, incentives, constraints, and timing.`,
      "The strongest answer explains both the main cause and the practical implication.",
      "A good next step is to compare the expected benefit with the cost or risk.",
    ];
  }

  if (type === "recommendation") {
    return [
      `The best choice depends on the goal, available context, and tolerance for tradeoffs.`,
      "A practical recommendation should name the next action and the reason behind it.",
      "If stakes are high, validate assumptions before committing.",
    ];
  }

  return [
    `${topic} can be understood by focusing on the core definition, use case, and outcome.`,
    "A useful answer should be specific enough to act on, not just descriptive.",
    "Add context, examples, or constraints when you need a more precise answer.",
  ];
}

function makeFollowUps(question: string) {
  const topic = topicFromQuestion(question);
  return [
    `What context would make the answer about ${topic} more specific?`,
    `What are the biggest tradeoffs or risks related to ${topic}?`,
    `What is the best next step if I want to apply this answer?`,
  ];
}

export function generateAiAnswer(input: AnswerGeneratorInput): AnswerGeneratorResult {
  const question = clean(input.question);

  if (!question) {
    throw new Error("Ask a question before generating an answer.");
  }

  const topic = topicFromQuestion(question);
  const keyPoints = makeKeyPoints(question);
  const followUps = makeFollowUps(question);
  const tone = toneGuidance[input.tone];
  const answer = [
    `## Answer`,
    `In ${input.language}, here is a ${tone} answer: ${topic} is best answered by looking at the goal, the context, and the practical next step. The short version is that the right answer depends on what you are trying to achieve, what constraints apply, and how precise the decision needs to be.`,
    `For most situations, start with the simplest useful explanation, then add details only where they change the decision. If the question affects money, health, legal obligations, safety, or important business decisions, verify the answer with a qualified source before acting.`,
    `## Key points`,
    keyPoints.map((point) => `- ${point}`).join("\n"),
    `## Suggested next step`,
    `Clarify the specific situation behind the question, then use the key points above to choose the most practical action.`,
  ].join("\n\n");
  const words = answer.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = answer.length;

  return {
    question,
    answer,
    keyPoints,
    followUps,
    language: input.language,
    tone: input.tone,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
  };
}

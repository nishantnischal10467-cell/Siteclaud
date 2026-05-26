export type EmailTone =
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

export type EmailResponseInput = {
  receivedEmail: string;
  subject: string;
  responseGoal: string;
  sender: string;
  recipient: string;
  language: string;
  tone: EmailTone;
};

export type EmailResponseResult = {
  subject: string;
  email: string;
  preview: string;
  notes: string[];
  language: string;
  tone: EmailTone;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

const toneGuidance: Record<EmailTone, string> = {
  approachable: "clear, warm, and easy to respond to",
  authoritative: "confident, direct, and credible",
  casual: "relaxed and conversational",
  enthusiastic: "positive and energetic",
  excited: "high-energy and appreciative",
  formal: "polished, respectful, and precise",
  friendly: "warm, helpful, and personable",
  funny: "light and memorable while staying professional",
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

function firstName(value: string, fallback: string) {
  const compact = clean(value);
  if (!compact) return fallback;
  return compact.split(/\s+/)[0].replace(/[<,]/g, "");
}

function extractAsk(email: string) {
  const compact = clean(email);
  const question = compact.split(/(?<=[?!.])\s+/).find((part) => part.includes("?"));
  if (question) return question;
  return compact.length > 150 ? `${compact.slice(0, 147).trim()}...` : compact;
}

function subjectLine(subject: string) {
  const compact = clean(subject);
  if (!compact) return "Re: Your message";
  return compact.toLowerCase().startsWith("re:") ? compact : `Re: ${compact}`;
}

export function generateEmailResponse(input: EmailResponseInput): EmailResponseResult {
  const receivedEmail = clean(input.receivedEmail);
  const goal = clean(input.responseGoal);

  if (!receivedEmail) {
    throw new Error("Paste the received email before generating a response.");
  }

  if (!goal) {
    throw new Error("Add a response goal before generating a response.");
  }

  const recipientName = firstName(input.recipient, "there");
  const senderName = firstName(input.sender, "Your Name");
  const tone = toneGuidance[input.tone];
  const ask = extractAsk(receivedEmail);
  const subject = subjectLine(input.subject);
  const email = [
    `Subject: ${subject}`,
    "",
    `Hi ${recipientName},`,
    "",
    `Thanks for reaching out. I read your note about "${ask}" and wanted to respond in a ${tone} way.`,
    "",
    goal,
    "",
    "A good next step is to confirm the details, align on the expected outcome, and keep the conversation moving without adding unnecessary back-and-forth.",
    "",
    "Please let me know if you would like me to clarify anything or send over more detail.",
    "",
    `Best,`,
    senderName,
  ].join("\n");
  const words = email.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = email.length;
  const notes = [
    "Acknowledges the original email before answering.",
    "Keeps the response goal visible and actionable.",
    "Ends with a clear, low-friction next step.",
  ];

  return {
    subject,
    email,
    preview: email.split("\n").filter(Boolean).slice(0, 3).join(" "),
    notes,
    language: input.language,
    tone: input.tone,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
  };
}

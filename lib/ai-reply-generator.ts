export type ReplySource =
  | "email"
  | "linkedin-comment"
  | "linkedin-message"
  | "x-tweet"
  | "x-reply"
  | "facebook-post"
  | "facebook-comment"
  | "instagram-comment"
  | "instagram-dm"
  | "youtube-comment"
  | "reddit-comment"
  | "discord-message"
  | "slack-message"
  | "whatsapp-message"
  | "text-message"
  | "other";

export type ReplyStyle = "professional" | "casual" | "friendly" | "enthusiastic" | "formal" | "informal" | "witty" | "empathetic" | "confident" | "diplomatic";
export type ReplyLength = "shorter" | "longer";

export type ReplyGeneratorInput = {
  message: string;
  instructions?: string;
  context?: string;
  source: ReplySource;
  language: string;
  style: ReplyStyle;
  length: ReplyLength;
};

export type ReplyGeneratorResult = {
  reply: string;
  alternatives: string[];
  source: ReplySource;
  language: string;
  style: ReplyStyle;
  length: ReplyLength;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

const sourceLabels: Record<ReplySource, string> = {
  email: "email",
  "linkedin-comment": "LinkedIn comment",
  "linkedin-message": "LinkedIn message",
  "x-tweet": "X post",
  "x-reply": "X reply",
  "facebook-post": "Facebook post",
  "facebook-comment": "Facebook comment",
  "instagram-comment": "Instagram comment",
  "instagram-dm": "Instagram DM",
  "youtube-comment": "YouTube comment",
  "reddit-comment": "Reddit comment",
  "discord-message": "Discord message",
  "slack-message": "Slack message",
  "whatsapp-message": "WhatsApp message",
  "text-message": "text message",
  other: "message",
};

const styleTone: Record<ReplyStyle, string> = {
  professional: "clear, useful, and professional",
  casual: "relaxed and natural",
  friendly: "warm, helpful, and easy to respond to",
  enthusiastic: "upbeat and appreciative",
  formal: "polished, respectful, and precise",
  informal: "simple, direct, and conversational",
  witty: "light, clever, and still helpful",
  empathetic: "understanding, patient, and reassuring",
  confident: "decisive, clear, and action-oriented",
  diplomatic: "balanced, tactful, and constructive",
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function sentenceCase(value: string) {
  const trimmed = clean(value);
  return trimmed ? trimmed[0].toUpperCase() + trimmed.slice(1) : trimmed;
}

function extractAsk(message: string) {
  const question = message.split(/(?<=[?!.])\s+/).find((part) => part.includes("?"));
  if (question) return clean(question);

  const compact = clean(message);
  return compact.length > 140 ? `${compact.slice(0, 137).trim()}...` : compact;
}

function opener(style: ReplyStyle, source: ReplySource) {
  if (style === "formal") return source === "email" ? "Thank you for your message." : "Thank you for sharing this.";
  if (style === "empathetic") return "I completely understand where you are coming from.";
  if (style === "enthusiastic") return "Absolutely, thanks for reaching out.";
  if (style === "witty") return "Good question, and happily not one that needs a maze of caveats.";
  if (style === "diplomatic") return "I appreciate you raising this, and I think there is a practical path forward.";
  if (style === "casual" || style === "informal") return "Thanks for the note.";
  return "Thanks for reaching out.";
}

function closing(style: ReplyStyle, length: ReplyLength) {
  if (style === "formal") return "Please let me know if you would like me to clarify anything further.";
  if (style === "empathetic") return "Happy to help with the next step from here.";
  if (style === "confident") return "I can take it from here and keep you updated.";
  if (length === "shorter") return "Hope that helps.";
  return "Let me know what you think, and I can adjust from there.";
}

function buildReply(input: ReplyGeneratorInput, variant: "primary" | "concise" | "warm") {
  const ask = extractAsk(input.message);
  const instruction = clean(input.instructions ?? "");
  const context = clean(input.context ?? "");
  const tone = styleTone[input.style];
  const source = sourceLabels[input.source];
  const open = variant === "concise" ? "Thanks for reaching out." : opener(input.style, input.source);
  const close = variant === "warm" ? "I appreciate you taking the time to send this." : closing(input.style, input.length);

  const shortReply = [
    open,
    instruction
      ? sentenceCase(instruction)
      : `I would respond in a ${tone} way and keep the focus on: ${ask}`,
    context ? `Given the context, ${context.toLowerCase()}` : "",
    close,
  ].filter(Boolean);

  if (input.length === "shorter" || variant === "concise") {
    return shortReply.join(" ");
  }

  return [
    open,
    `I read your ${source} carefully, especially this part: "${ask}"`,
    instruction
      ? sentenceCase(instruction)
      : `My take is to answer directly, stay ${tone}, and make the next step easy.`,
    context ? `For context, ${context}` : "",
    "Here is what I suggest: acknowledge the point, give a clear answer, and invite one simple next action so the conversation keeps moving.",
    close,
  ].filter(Boolean).join("\n\n");
}

export function generateAiReply(input: ReplyGeneratorInput): ReplyGeneratorResult {
  const reply = buildReply(input, "primary");
  const alternatives = [
    buildReply({ ...input, length: "shorter" }, "concise"),
    buildReply({ ...input, style: input.style === "empathetic" ? "friendly" : "empathetic" }, "warm"),
  ].filter((item, index, items) => item !== reply && items.indexOf(item) === index);
  const words = reply.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = reply.length;

  return {
    reply,
    alternatives,
    source: input.source,
    language: input.language,
    style: input.style,
    length: input.length,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
  };
}

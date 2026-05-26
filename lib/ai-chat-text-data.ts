export type ChatTextDataInput = {
  text: string;
  question: string;
};

export type ChatTextEvidence = {
  excerpt: string;
  score: number;
};

export type ChatTextDataResult = {
  answer: string;
  evidence: ChatTextEvidence[];
  suggestedQuestions: string[];
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  confidence: "low" | "medium" | "high";
};

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "can",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "our",
  "that",
  "the",
  "this",
  "to",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
  "you",
  "your",
]);

function clean(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function wordCount(value: string) {
  return clean(value).split(/\s+/).filter(Boolean).length;
}

function keywords(value: string) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 16);
}

function splitIntoChunks(text: string) {
  const paragraphs = text
    .split(/\n{2,}|(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map(clean)
    .filter((item) => item.length > 30);

  if (paragraphs.length) {
    return paragraphs.slice(0, 120);
  }

  const cleaned = clean(text);
  const chunks: string[] = [];
  for (let index = 0; index < cleaned.length; index += 500) {
    chunks.push(cleaned.slice(index, index + 500));
  }
  return chunks;
}

function scoreChunk(chunk: string, terms: string[]) {
  const normalized = chunk.toLowerCase();
  return terms.reduce((score, term) => {
    if (normalized.includes(term)) return score + (term.length > 6 ? 3 : 2);
    return score;
  }, 0);
}

function summarizeEvidence(evidence: ChatTextEvidence[], terms: string[]) {
  if (!evidence.length) {
    return "I could not find a strong match in the pasted text. Try asking with terms that appear directly in the source text.";
  }

  const termPhrase = terms.slice(0, 5).join(", ");
  const lead = evidence[0].excerpt;
  const support = evidence.slice(1, 3).map((item) => item.excerpt);

  return [
    `Based on the pasted text, the strongest answer is: ${lead}`,
    support.length ? `Supporting context: ${support.join(" ")}` : "",
    termPhrase ? `I matched this using the key terms: ${termPhrase}.` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function confidenceFromEvidence(evidence: ChatTextEvidence[]) {
  const topScore = evidence[0]?.score ?? 0;
  if (topScore >= 8) return "high";
  if (topScore >= 3) return "medium";
  return "low";
}

function suggestedQuestionsFromText(text: string, terms: string[]) {
  const topic = terms[0] ?? "this text";
  const count = wordCount(text);
  return [
    `Summarize the main point about ${topic}.`,
    "What are the most important facts in this text?",
    count > 250 ? "Turn this into a short executive summary." : "What follow-up question should I ask next?",
  ];
}

export function chatWithTextData(input: ChatTextDataInput): ChatTextDataResult {
  const text = clean(input.text).slice(0, 25_000);
  const question = clean(input.question).slice(0, 1_000);

  if (!text) {
    throw new Error("Paste text data before asking a question.");
  }

  if (!question) {
    throw new Error("Ask a question about your pasted text.");
  }

  const terms = keywords(question);
  const chunks = splitIntoChunks(text);
  const scored = chunks
    .map((chunk) => ({ excerpt: chunk.slice(0, 700), score: scoreChunk(chunk, terms) }))
    .sort((first, second) => second.score - first.score);
  const evidence = scored.filter((item) => item.score > 0).slice(0, 4);
  const fallbackEvidence = evidence.length ? evidence : scored.slice(0, 2).map((item) => ({ ...item, score: 0 }));
  const answer = summarizeEvidence(evidence, terms);
  const characterCount = text.length;

  return {
    answer,
    evidence: fallbackEvidence,
    suggestedQuestions: suggestedQuestionsFromText(text, terms),
    wordCount: wordCount(text),
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
    confidence: confidenceFromEvidence(evidence),
  };
}

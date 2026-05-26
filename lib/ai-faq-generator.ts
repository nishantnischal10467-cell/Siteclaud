export type FaqTone =
  | "approachable"
  | "authoritative"
  | "casual"
  | "enthusiastic"
  | "formal"
  | "friendly"
  | "funny"
  | "neutral"
  | "optimistic"
  | "persuasive"
  | "professional"
  | "thoughtful";

export type FaqGeneratorInput = {
  content: string;
  count: 1 | 4 | 7 | 10;
  language: string;
  tone: FaqTone;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqGeneratorResult = {
  title: string;
  faqs: FaqItem[];
  markdown: string;
  jsonLd: string;
  language: string;
  tone: FaqTone;
  count: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

const toneGuidance: Record<FaqTone, string> = {
  approachable: "clear and easy to understand",
  authoritative: "confident and precise",
  casual: "natural and conversational",
  enthusiastic: "positive and energetic",
  formal: "polished and respectful",
  friendly: "warm and helpful",
  funny: "light and memorable while still useful",
  neutral: "balanced and direct",
  optimistic: "encouraging and positive",
  persuasive: "benefit-led and reassuring",
  professional: "clear, credible, and business-ready",
  thoughtful: "careful, nuanced, and helpful",
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function titleFromContent(content: string) {
  const compact = clean(content);
  const firstSentence = compact.split(/(?<=[.!?])\s+/)[0] || compact;
  return firstSentence.length > 70 ? `${firstSentence.slice(0, 67).trim()}...` : firstSentence || "Generated FAQs";
}

function extractKeywords(content: string) {
  const stopWords = new Set(["about", "after", "again", "also", "because", "before", "being", "could", "every", "from", "have", "into", "more", "most", "over", "that", "their", "there", "these", "they", "this", "through", "with", "your", "and", "the", "for", "you", "our", "are", "can"]);
  const words = clean(content)
    .toLowerCase()
    .match(/\b[a-z][a-z0-9'-]{3,}\b/g) ?? [];
  const counts = new Map<string, number>();

  for (const word of words) {
    if (!stopWords.has(word)) counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function makeFaqs(input: FaqGeneratorInput): FaqItem[] {
  const compact = clean(input.content);
  const title = titleFromContent(compact);
  const keywords = extractKeywords(compact);
  const subject = keywords.slice(0, 3).join(", ") || title.toLowerCase();
  const tone = toneGuidance[input.tone];
  const sourceSummary = compact.length > 180 ? `${compact.slice(0, 177).trim()}...` : compact;
  const templates: Array<(index: number) => FaqItem> = [
    () => ({
      question: `What is ${title}?`,
      answer: `${title} is best understood through its core details: ${sourceSummary} This answer is written in a ${tone} tone for ${input.language} readers.`,
    }),
    () => ({
      question: `Who is this most useful for?`,
      answer: `It is most useful for people who need practical clarity around ${subject}. The key is to focus on the audience's goal, the available context, and the next action they should take.`,
    }),
    () => ({
      question: `What are the main benefits?`,
      answer: `The main benefits are clearer information, faster decision-making, and a more consistent way to explain ${subject}. Good FAQs reduce repeated questions and help users self-serve.`,
    }),
    () => ({
      question: `How does it work?`,
      answer: `Start with the source content, identify recurring questions, then answer each one directly. Keep the language ${tone}, avoid vague claims, and include concrete details wherever possible.`,
    }),
    () => ({
      question: `What should users know before getting started?`,
      answer: `Users should know the scope, any limits, and the expected outcome. If the content has policies, pricing, setup steps, or support details, those should be made explicit in the FAQ.`,
    }),
    () => ({
      question: `Can this be customized?`,
      answer: `Yes. The FAQ can be adapted by changing the tone, language, number of questions, and the level of detail. Add product-specific examples to make each answer more useful.`,
    }),
    () => ({
      question: `What information should be included in each answer?`,
      answer: `Each answer should include the direct response first, followed by any conditions, examples, or next steps. This keeps the FAQ useful for both human readers and AI systems.`,
    }),
    () => ({
      question: `How can these FAQs improve support?`,
      answer: `They can reduce repetitive tickets, improve chatbot training data, and make important information easier to find. Clear FAQs also help teams keep messaging consistent across channels.`,
    }),
    () => ({
      question: `How often should the FAQ be updated?`,
      answer: `Update it whenever the source content changes, when new objections appear, or when support teams notice repeated questions. A regular review keeps answers accurate and trustworthy.`,
    }),
    () => ({
      question: `What is the best next step?`,
      answer: `Review the generated questions, replace generic phrasing with brand-specific details, and publish the final FAQ where users naturally look for help.`,
    }),
  ];

  return templates.slice(0, input.count).map((template, index) => template(index));
}

function toMarkdown(title: string, faqs: FaqItem[]) {
  return [`# FAQs: ${title}`, ...faqs.map((faq) => `## ${faq.question}\n\n${faq.answer}`)].join("\n\n");
}

function toJsonLd(faqs: FaqItem[]) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    null,
    2,
  );
}

export function generateAiFaqs(input: FaqGeneratorInput): FaqGeneratorResult {
  const content = clean(input.content);

  if (!content) {
    throw new Error("Add content before generating FAQs.");
  }

  const title = titleFromContent(content);
  const faqs = makeFaqs({ ...input, content });
  const markdown = toMarkdown(title, faqs);
  const jsonLd = toJsonLd(faqs);
  const words = markdown.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = markdown.length;

  return {
    title,
    faqs,
    markdown,
    jsonLd,
    language: input.language,
    tone: input.tone,
    count: faqs.length,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
  };
}

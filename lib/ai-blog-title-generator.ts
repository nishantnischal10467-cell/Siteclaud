export type BlogTitleTone =
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

export type BlogTitleGeneratorInput = {
  keywords: string;
  summary: string;
  audience: string;
  language: string;
  tone: BlogTitleTone;
};

export type BlogTitleOption = {
  title: string;
  angle: string;
  score: number;
};

export type BlogTitleGeneratorResult = {
  titles: BlogTitleOption[];
  markdown: string;
  language: string;
  tone: BlogTitleTone;
  keywordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

const toneWords: Record<BlogTitleTone, string[]> = {
  approachable: ["Simple", "Easy", "Practical"],
  authoritative: ["Definitive", "Expert", "Complete"],
  casual: ["No-Fuss", "Easy", "Real-World"],
  enthusiastic: ["Powerful", "Exciting", "High-Impact"],
  excited: ["Game-Changing", "Must-Read", "Breakthrough"],
  formal: ["Comprehensive", "Professional", "Strategic"],
  friendly: ["Helpful", "Simple", "Practical"],
  funny: ["Surprisingly Useful", "No-Nonsense", "Actually Helpful"],
  informal: ["Quick", "Simple", "Real-World"],
  innovative: ["Modern", "Next-Gen", "Forward-Looking"],
  inspirational: ["Transformative", "Better", "Smarter"],
  neutral: ["Clear", "Practical", "Complete"],
  optimistic: ["Better", "Smarter", "Growth-Ready"],
  persuasive: ["Proven", "High-Converting", "Compelling"],
  pessimistic: ["Risk-Aware", "No-Nonsense", "Practical"],
  professional: ["Professional", "Strategic", "Practical"],
  thoughtful: ["Nuanced", "Practical", "Thoughtful"],
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function parseKeywords(value: string) {
  return clean(value)
    .split(/[,;\n]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function titleCase(value: string) {
  return clean(value).replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

function primaryTopic(keywords: string[], summary: string) {
  if (keywords[0]) return titleCase(keywords[0]);
  const compact = clean(summary);
  return titleCase(compact.length > 42 ? `${compact.slice(0, 39).trim()}...` : compact || "Your Topic");
}

function audienceLabel(audience: string) {
  const compact = clean(audience);
  return compact || "Busy Teams";
}

function scoreTitle(title: string, keywords: string[]) {
  const lengthScore = title.length >= 45 && title.length <= 68 ? 35 : title.length <= 80 ? 24 : 16;
  const keywordScore = keywords.some((keyword) => title.toLowerCase().includes(keyword.toLowerCase())) ? 35 : 20;
  const clarityScore = /how|why|guide|ways|tips|best|complete|simple|practical/i.test(title) ? 25 : 18;
  return Math.min(100, lengthScore + keywordScore + clarityScore + 5);
}

export function generateBlogTitles(input: BlogTitleGeneratorInput): BlogTitleGeneratorResult {
  const keywords = parseKeywords(input.keywords);
  const summary = clean(input.summary);
  const audience = audienceLabel(input.audience);

  if (!keywords.length && !summary) {
    throw new Error("Add keywords or a blog summary before generating titles.");
  }

  const topic = primaryTopic(keywords, summary);
  const toneSet = toneWords[input.tone];
  const modifier = toneSet[0];
  const secondary = keywords[1] ? titleCase(keywords[1]) : "Better Results";
  const rawTitles = [
    [`How to Use ${topic} to Get ${secondary}`, "How-to"],
    [`${modifier} Guide to ${topic} for ${audience}`, "Guide"],
    [`${topic}: ${toneSet[1]} Tips for ${audience}`, "Listicle"],
    [`Why ${topic} Matters More Than Ever`, "Thought leadership"],
    [`The ${toneSet[2]} Way to Improve ${topic}`, "Benefit-led"],
    [`${topic} for Beginners: What to Know First`, "Beginner"],
    [`Best Practices for ${topic} Without the Guesswork`, "Best practices"],
    [`From Idea to Action: A ${modifier} ${topic} Playbook`, "Playbook"],
  ] as const;

  const seen = new Set<string>();
  const titles = rawTitles
    .map(([title, angle]) => ({ title, angle, score: scoreTitle(title, keywords) }))
    .filter((item) => {
      const key = item.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const markdown = [
    "# AI Blog Title Ideas",
    `Language: ${input.language}`,
    `Tone: ${input.tone}`,
    "",
    ...titles.map((item, index) => `${index + 1}. **${item.title}**\n   - Angle: ${item.angle}\n   - SEO score: ${item.score}/100`),
  ].join("\n");
  const characterCount = markdown.length;

  return {
    titles,
    markdown,
    language: input.language,
    tone: input.tone,
    keywordCount: keywords.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
  };
}

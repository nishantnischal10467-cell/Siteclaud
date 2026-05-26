export type ChatbotNameTone =
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

export type ChatbotIndustry =
  | "agriculture"
  | "automotive"
  | "construction"
  | "crypto"
  | "customer-support"
  | "cybersecurity"
  | "dating"
  | "e-commerce"
  | "education"
  | "energy"
  | "entertainment"
  | "environmental"
  | "fashion"
  | "finance"
  | "food-and-beverage"
  | "gaming"
  | "government"
  | "healthcare"
  | "hospitality"
  | "insurance"
  | "legal"
  | "manufacturing"
  | "marketing"
  | "media"
  | "non-profit"
  | "pharmaceuticals"
  | "real-estate"
  | "software"
  | "sports"
  | "telecommunications"
  | "transportation"
  | "travel"
  | "web3";

export type ChatbotNameGeneratorInput = {
  keywords: string;
  description: string;
  tone: ChatbotNameTone;
  industry: ChatbotIndustry;
  prefix?: string;
  suffix?: string;
};

export type ChatbotNameOption = {
  name: string;
  style: string;
  rationale: string;
  score: number;
};

export type ChatbotNameGeneratorResult = {
  names: ChatbotNameOption[];
  markdown: string;
  tone: ChatbotNameTone;
  industry: ChatbotIndustry;
  keywordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

const industryWords: Record<ChatbotIndustry, string[]> = {
  agriculture: ["Harvest", "Field", "Agri"],
  automotive: ["Drive", "Motor", "Auto"],
  construction: ["Build", "Beam", "Struct"],
  crypto: ["Chain", "Block", "Ledger"],
  "customer-support": ["Help", "Care", "Assist"],
  cybersecurity: ["Shield", "Guard", "Secure"],
  dating: ["Match", "Spark", "Connect"],
  "e-commerce": ["Cart", "Shop", "Retail"],
  education: ["Tutor", "Learn", "Scholar"],
  energy: ["Volt", "Power", "Grid"],
  entertainment: ["Stage", "Show", "Vibe"],
  environmental: ["Eco", "Green", "Terra"],
  fashion: ["Style", "Mode", "Trend"],
  finance: ["Fin", "Ledger", "Capital"],
  "food-and-beverage": ["Taste", "Table", "Bistro"],
  gaming: ["Quest", "Pixel", "Arena"],
  government: ["Civic", "Public", "Gov"],
  healthcare: ["Care", "Med", "Health"],
  hospitality: ["Host", "Stay", "Guest"],
  insurance: ["Cover", "Sure", "Policy"],
  legal: ["Lex", "Brief", "Counsel"],
  manufacturing: ["Forge", "Plant", "Mach"],
  marketing: ["Growth", "Brand", "Campaign"],
  media: ["Stream", "Press", "Story"],
  "non-profit": ["Impact", "Cause", "Giving"],
  pharmaceuticals: ["Pharma", "Dose", "Medi"],
  "real-estate": ["Home", "Estate", "Nest"],
  software: ["Code", "Stack", "Cloud"],
  sports: ["Play", "Score", "Team"],
  telecommunications: ["Signal", "Connect", "Wave"],
  transportation: ["Route", "Transit", "Fleet"],
  travel: ["Trip", "Roam", "Voyage"],
  web3: ["Chain", "Node", "Nexus"],
};

const toneWords: Record<ChatbotNameTone, string[]> = {
  approachable: ["Buddy", "Guide", "Pal"],
  authoritative: ["Atlas", "Prime", "Command"],
  casual: ["Mate", "Sidekick", "Buddy"],
  enthusiastic: ["Spark", "Boost", "Dash"],
  excited: ["Blitz", "Rocket", "Zap"],
  formal: ["Advisor", "Concierge", "Assistant"],
  friendly: ["Helper", "Buddy", "Guide"],
  funny: ["Chatter", "Witty", "Giggle"],
  informal: ["Pal", "Mate", "Buddy"],
  innovative: ["Nova", "Nexus", "Flux"],
  inspirational: ["Rise", "Beacon", "Aspire"],
  neutral: ["Assist", "Guide", "Bot"],
  optimistic: ["Bright", "Lift", "Hope"],
  persuasive: ["Convert", "Pitch", "Nudge"],
  pessimistic: ["Prudent", "Caution", "Risk"],
  professional: ["Advisor", "Pilot", "Desk"],
  thoughtful: ["Sage", "Clarity", "Compass"],
};

function clean(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function parseKeywords(value: string) {
  return clean(value)
    .split(/[,;\n]/)
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function titleCase(value: string) {
  return clean(value).replace(/\w\S*/g, (word) => word[0].toUpperCase() + word.slice(1).toLowerCase());
}

function compactWord(value: string) {
  return titleCase(value).replace(/[^a-z0-9]/gi, "");
}

function applyAffixes(name: string, prefix?: string, suffix?: string) {
  const safePrefix = compactWord(prefix ?? "");
  const safeSuffix = compactWord(suffix ?? "");
  return `${safePrefix}${name}${safeSuffix}`;
}

function scoreName(name: string, keywordCount: number) {
  const lengthScore = name.length >= 5 && name.length <= 14 ? 38 : name.length <= 18 ? 28 : 18;
  const memorability = /[aeiou]/i.test(name) && !/(.)\1\1/i.test(name) ? 28 : 18;
  const keywordScore = keywordCount ? 24 : 16;
  return Math.min(100, lengthScore + memorability + keywordScore + 10);
}

export function generateChatbotNames(input: ChatbotNameGeneratorInput): ChatbotNameGeneratorResult {
  const keywords = parseKeywords(input.keywords);
  const description = clean(input.description);

  if (!keywords.length && !description) {
    throw new Error("Add keywords or a chatbot description before generating names.");
  }

  const industrySet = industryWords[input.industry];
  const toneSet = toneWords[input.tone];
  const keywordSet = keywords.map(compactWord).filter(Boolean);
  const base = keywordSet[0] || industrySet[0];
  const rawNames = [
    [applyAffixes(`${base}${toneSet[0]}`, input.prefix, input.suffix), "Friendly"],
    [applyAffixes(`${industrySet[0]}${toneSet[1]}`, input.prefix, input.suffix), "Industry-led"],
    [applyAffixes(`${toneSet[2]}${industrySet[1]}`, input.prefix, input.suffix), "Personality"],
    [applyAffixes(`${base}Pilot`, input.prefix, input.suffix), "Assistant"],
    [applyAffixes(`${industrySet[2]}Mate`, input.prefix, input.suffix), "Conversational"],
    [applyAffixes(`${base}Nexus`, input.prefix, input.suffix), "Modern"],
    [applyAffixes(`${toneSet[0]}Desk`, input.prefix, input.suffix), "Support"],
    [applyAffixes(`${industrySet[0]}Bot`, input.prefix, input.suffix), "Direct"],
    [applyAffixes(`${base}Guide`, input.prefix, input.suffix), "Helpful"],
    [applyAffixes(`${toneSet[1]}AI`, input.prefix, input.suffix), "AI-native"],
  ] as const;
  const seen = new Set<string>();
  const names = rawNames
    .map(([name, style]) => ({
      name,
      style,
      rationale: `${name} matches a ${input.tone} chatbot for the ${input.industry.replace(/-/g, " ")} industry and is short enough to feel memorable in product UI.`,
      score: scoreName(name, keywords.length),
    }))
    .filter((item) => {
      const key = item.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const markdown = [
    "# AI Chatbot Name Ideas",
    `Tone: ${input.tone}`,
    `Industry: ${input.industry.replace(/-/g, " ")}`,
    "",
    ...names.map((item, index) => `${index + 1}. **${item.name}**\n   - Style: ${item.style}\n   - Score: ${item.score}/100\n   - Why it works: ${item.rationale}`),
  ].join("\n");
  const characterCount = markdown.length;

  return {
    names,
    markdown,
    tone: input.tone,
    industry: input.industry,
    keywordCount: keywords.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
  };
}

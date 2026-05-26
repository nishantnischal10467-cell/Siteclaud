export type SaasBrandTone =
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

export type SaasBrandIndustry =
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

export type SaasBrandNameGeneratorInput = {
  keywords: string;
  description: string;
  tone: SaasBrandTone;
  industry: SaasBrandIndustry;
};

export type SaasBrandNameOption = {
  name: string;
  domainHint: string;
  style: string;
  rationale: string;
  score: number;
};

export type SaasBrandNameGeneratorResult = {
  names: SaasBrandNameOption[];
  markdown: string;
  tone: SaasBrandTone;
  industry: SaasBrandIndustry;
  keywordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

const industryWords: Record<SaasBrandIndustry, string[]> = {
  agriculture: ["Harvest", "Field", "Agri"],
  automotive: ["Drive", "Motor", "Auto"],
  construction: ["Build", "Beam", "Struct"],
  crypto: ["Chain", "Block", "Ledger"],
  "customer-support": ["Help", "Care", "Resolve"],
  cybersecurity: ["Shield", "Guard", "Secure"],
  dating: ["Match", "Spark", "Bond"],
  "e-commerce": ["Cart", "Shop", "Commerce"],
  education: ["Learn", "Tutor", "Scholar"],
  energy: ["Volt", "Grid", "Power"],
  entertainment: ["Stage", "Show", "Vibe"],
  environmental: ["Eco", "Green", "Terra"],
  fashion: ["Style", "Mode", "Trend"],
  finance: ["Fin", "Capital", "Ledger"],
  "food-and-beverage": ["Taste", "Table", "Bistro"],
  gaming: ["Quest", "Pixel", "Arena"],
  government: ["Civic", "Public", "Gov"],
  healthcare: ["Care", "Med", "Health"],
  hospitality: ["Host", "Stay", "Guest"],
  insurance: ["Cover", "Sure", "Policy"],
  legal: ["Lex", "Brief", "Counsel"],
  manufacturing: ["Forge", "Plant", "Factory"],
  marketing: ["Growth", "Brand", "Campaign"],
  media: ["Stream", "Press", "Story"],
  "non-profit": ["Impact", "Cause", "Giving"],
  pharmaceuticals: ["Pharma", "Dose", "Medi"],
  "real-estate": ["Home", "Estate", "Nest"],
  software: ["Stack", "Cloud", "Code"],
  sports: ["Play", "Score", "Team"],
  telecommunications: ["Signal", "Connect", "Wave"],
  transportation: ["Route", "Transit", "Fleet"],
  travel: ["Trip", "Roam", "Voyage"],
  web3: ["Chain", "Node", "Nexus"],
};

const toneWords: Record<SaasBrandTone, string[]> = {
  approachable: ["Simple", "Friendly", "Open"],
  authoritative: ["Prime", "Command", "Atlas"],
  casual: ["Easy", "Swift", "Buddy"],
  enthusiastic: ["Spark", "Boost", "Dash"],
  excited: ["Rocket", "Blitz", "Zap"],
  formal: ["Suite", "Desk", "Office"],
  friendly: ["Helper", "Bright", "Buddy"],
  funny: ["Witty", "Quirk", "Chuckle"],
  informal: ["Pal", "Easy", "Mate"],
  innovative: ["Nova", "Nexus", "Flux"],
  inspirational: ["Rise", "Beacon", "Aspire"],
  neutral: ["Core", "Base", "Hub"],
  optimistic: ["Lift", "Bright", "Hope"],
  persuasive: ["Convert", "Nudge", "Pitch"],
  pessimistic: ["Prudent", "Caution", "Guard"],
  professional: ["Pilot", "Suite", "Desk"],
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

function domainHint(name: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
}

function scoreName(name: string, keywordCount: number) {
  const lengthScore = name.length >= 5 && name.length <= 13 ? 38 : name.length <= 17 ? 30 : 20;
  const clarityScore = /[aeiou]/i.test(name) ? 24 : 16;
  const brandScore = /(ly|io|hub|base|pilot|suite|cloud|stack|nexus|flow)$/i.test(name) ? 20 : 14;
  const keywordScore = keywordCount ? 18 : 12;
  return Math.min(100, lengthScore + clarityScore + brandScore + keywordScore);
}

export function generateSaasBrandNames(input: SaasBrandNameGeneratorInput): SaasBrandNameGeneratorResult {
  const keywords = parseKeywords(input.keywords);
  const description = clean(input.description);

  if (!keywords.length && !description) {
    throw new Error("Add keywords or a SaaS description before generating brand names.");
  }

  const industrySet = industryWords[input.industry];
  const toneSet = toneWords[input.tone];
  const keywordSet = keywords.map(compactWord).filter(Boolean);
  const base = keywordSet[0] || industrySet[0];
  const rawNames = [
    [`${base}${toneSet[0]}`, "Benefit-led"],
    [`${industrySet[0]}${toneSet[1]}`, "Category fit"],
    [`${toneSet[2]}${industrySet[1]}`, "Personality"],
    [`${base}Launch`, "Workflow"],
    [`${industrySet[2]}Hub`, "Platform"],
    [`${base}Nexus`, "Modern"],
    [`${toneSet[0]}Stack`, "Technical"],
    [`${industrySet[0]}Flow`, "Automation"],
    [`${base}Suite`, "B2B SaaS"],
    [`${toneSet[1]}Cloud`, "Cloud-native"],
  ] as const;
  const seen = new Set<string>();
  const names = rawNames
    .map(([name, style]) => ({
      name,
      domainHint: domainHint(name),
      style,
      rationale: `${name} feels ${input.tone}, fits the ${input.industry.replace(/-/g, " ")} market, and suggests a focused SaaS product rather than a generic service.`,
      score: scoreName(name, keywords.length),
    }))
    .filter((item) => {
      const key = item.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  const markdown = [
    "# AI SaaS Brand Name Ideas",
    `Tone: ${input.tone}`,
    `Industry: ${input.industry.replace(/-/g, " ")}`,
    "",
    ...names.map((item, index) => `${index + 1}. **${item.name}**\n   - Style: ${item.style}\n   - Domain hint: ${item.domainHint}\n   - Score: ${item.score}/100\n   - Why it works: ${item.rationale}`),
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

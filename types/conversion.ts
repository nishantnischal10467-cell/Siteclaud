export type ConversionResponse = {
  url: string;
  title: string;
  description: string;
  favicon: string | null;
  markdown: string;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

export type PdfConversionResponse = {
  fileName: string;
  title: string;
  markdown: string;
  pageCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

export type DocxConversionResponse = {
  fileName: string;
  title: string;
  markdown: string;
  messageCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

export type HtmlConversionResponse = {
  fileName: string | null;
  title: string;
  markdown: string;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

export type XmlConversionResponse = {
  fileName: string | null;
  title: string;
  markdown: string;
  nodeCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

export type CsvConversionResponse = {
  fileName: string | null;
  title: string;
  markdown: string;
  rowCount: number;
  columnCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

export type JsonConversionResponse = {
  fileName: string | null;
  title: string;
  markdown: string;
  nodeCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

export type RtfConversionResponse = {
  fileName: string;
  title: string;
  markdown: string;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

export type PasteFormat = "auto" | "plain" | "rich" | "code" | "table";

export type PasteConversionResponse = {
  title: string;
  markdown: string;
  detectedFormat: Exclude<PasteFormat, "auto">;
  lineCount: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  fileSize: number;
};

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

export type AiReplyGeneratorResponse = {
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

export type PromptFramework = "ape" | "tag" | "race" | "care" | "rise" | "era" | "create" | "trace" | "roses" | "spark";
export type PromptTone = "clear" | "professional" | "creative" | "technical" | "friendly" | "academic" | "persuasive" | "strategic";
export type PromptLength = "concise" | "detailed";

export type AiPromptGeneratorResponse = {
  title: string;
  prompt: string;
  framework: PromptFramework;
  tone: PromptTone;
  length: PromptLength;
  sections: number;
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

export type AiPromptOptimizerResponse = {
  optimizedPrompt: string;
  framework: PromptFramework;
  tone: PromptTone;
  length: PromptLength;
  diagnosis: string[];
  improvements: string[];
  originalWordCount: number;
  optimizedWordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

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

export type FaqItem = {
  question: string;
  answer: string;
};

export type AiFaqGeneratorResponse = {
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

export type AiAnswerGeneratorResponse = {
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

export type AiEmailResponseGeneratorResponse = {
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

export type AiLetterGeneratorResponse = {
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

export type BlogTitleOption = {
  title: string;
  angle: string;
  score: number;
};

export type AiBlogTitleGeneratorResponse = {
  titles: BlogTitleOption[];
  markdown: string;
  language: string;
  tone: BlogTitleTone;
  keywordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

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

export type ChatbotNameOption = {
  name: string;
  style: string;
  rationale: string;
  score: number;
};

export type AiChatbotNameGeneratorResponse = {
  names: ChatbotNameOption[];
  markdown: string;
  tone: ChatbotNameTone;
  industry: ChatbotIndustry;
  keywordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

export type SaasBrandTone = ChatbotNameTone;
export type SaasBrandIndustry = ChatbotIndustry;

export type SaasBrandNameOption = {
  name: string;
  domainHint: string;
  style: string;
  rationale: string;
  score: number;
};

export type AiSaasBrandNameGeneratorResponse = {
  names: SaasBrandNameOption[];
  markdown: string;
  tone: SaasBrandTone;
  industry: SaasBrandIndustry;
  keywordCount: number;
  characterCount: number;
  tokenEstimate: number;
};

export type ChatTextEvidence = {
  excerpt: string;
  score: number;
};

export type AiChatTextDataResponse = {
  answer: string;
  evidence: ChatTextEvidence[];
  suggestedQuestions: string[];
  wordCount: number;
  characterCount: number;
  tokenEstimate: number;
  confidence: "low" | "medium" | "high";
};

export type AiChatWebsiteDataResponse = AiChatTextDataResponse & {
  url: string;
  title: string;
  description: string;
  favicon: string | null;
};

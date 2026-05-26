import { generateAiPrompt, type PromptFramework, type PromptLength, type PromptTone } from "@/lib/ai-prompt-generator";

export type PromptOptimizerInput = {
  framework: PromptFramework;
  prompt: string;
  tone: PromptTone;
  length: PromptLength;
};

export type PromptOptimizerResult = {
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

const frameworkNames: Record<PromptFramework, string> = {
  ape: "APE",
  tag: "TAG",
  race: "RACE",
  care: "CARE",
  rise: "RISE",
  era: "ERA",
  create: "CREATE",
  trace: "TRACE",
  roses: "ROSES",
  spark: "SPARK",
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function firstSentence(value: string) {
  return clean(value).split(/(?<=[.!?])\s+/)[0] || clean(value);
}

function extractGoal(prompt: string) {
  const compact = clean(prompt);
  const goalCue = compact.match(/(?:so that|in order to|goal is to|purpose is to|to help)\s+([^.!?]+)/i);
  if (goalCue?.[1]) return goalCue[1].trim();
  return "Make the output clearer, more useful, and easier for an AI model to follow.";
}

function extractOutput(prompt: string) {
  const outputCue = clean(prompt).match(/(?:return|create|generate|write|provide)\s+([^.!?]*(?:checklist|table|json|summary|outline|plan|draft|list|steps|paragraphs)[^.!?]*)/i);
  if (outputCue?.[1]) return outputCue[1].trim();
  return "Return a structured answer with headings, examples, and concrete next steps.";
}

function diagnosePrompt(prompt: string) {
  const diagnosis: string[] = [];
  const compact = clean(prompt);

  if (compact.length < 160) diagnosis.push("The original prompt is short and likely missing context, constraints, or output expectations.");
  if (!/(act as|you are|role)/i.test(compact)) diagnosis.push("No clear role is assigned to guide the model's perspective.");
  if (!/(context|background|audience|for\s+\w+)/i.test(compact)) diagnosis.push("Audience or background context is under-specified.");
  if (!/(format|return|output|table|json|bullet|paragraph|checklist)/i.test(compact)) diagnosis.push("The desired output format is not explicit.");
  if (!/(do not|avoid|must|include|constraint|requirement)/i.test(compact)) diagnosis.push("Guardrails and constraints are not clearly stated.");

  return diagnosis.length ? diagnosis : ["The original prompt has a useful foundation, but it can be more structured and easier to execute."];
}

export function optimizeAiPrompt(input: PromptOptimizerInput): PromptOptimizerResult {
  const prompt = clean(input.prompt);

  if (!prompt) {
    throw new Error("Paste your current prompt before optimizing.");
  }

  const task = firstSentence(prompt);
  const goal = extractGoal(prompt);
  const output = extractOutput(prompt);
  const generated = generateAiPrompt({
    framework: input.framework,
    task,
    goal,
    context: prompt,
    audience: "the intended user or decision-maker",
    output,
    tone: input.tone,
    length: input.length,
  });
  const diagnosis = diagnosePrompt(prompt);
  const improvements = [
    `Rebuilt the prompt with the ${frameworkNames[input.framework]} framework.`,
    "Separated task, context, expectations, and guardrails into scannable sections.",
    "Made the output format explicit so the model has a clearer target.",
    "Added anti-hallucination guardrails and practical response expectations.",
  ];
  const originalWords = prompt.match(/\b[\w'-]+\b/g) ?? [];
  const optimizedWords = generated.prompt.match(/\b[\w'-]+\b/g) ?? [];

  return {
    optimizedPrompt: generated.prompt,
    framework: input.framework,
    tone: input.tone,
    length: input.length,
    diagnosis,
    improvements,
    originalWordCount: originalWords.length,
    optimizedWordCount: optimizedWords.length,
    characterCount: generated.prompt.length,
    tokenEstimate: Math.ceil(generated.prompt.length / 4),
  };
}

export type PromptFramework = "ape" | "tag" | "race" | "care" | "rise" | "era" | "create" | "trace" | "roses" | "spark";
export type PromptTone = "clear" | "professional" | "creative" | "technical" | "friendly" | "academic" | "persuasive" | "strategic";
export type PromptLength = "concise" | "detailed";

export type PromptGeneratorInput = {
  framework: PromptFramework;
  task: string;
  goal: string;
  context?: string;
  audience?: string;
  output?: string;
  tone: PromptTone;
  length: PromptLength;
};

export type PromptGeneratorResult = {
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

const frameworkSections: Record<PromptFramework, Array<[string, (input: PromptGeneratorInput) => string]>> = {
  ape: [
    ["Action", (input) => input.task],
    ["Purpose", (input) => input.goal],
    ["Expectation", (input) => input.output || `Return a ${input.length} answer in a ${input.tone} tone.`],
  ],
  tag: [
    ["Task", (input) => input.task],
    ["Action", (input) => input.goal],
    ["Goal", (input) => input.output || "Produce a useful, ready-to-use result."],
  ],
  race: [
    ["Role", (input) => `Act as an expert for ${input.audience || "the target audience"}.`],
    ["Action", (input) => input.task],
    ["Context", (input) => input.context || input.goal],
    ["Expectation", (input) => input.output || `Use a ${input.tone} tone and make the response ${input.length}.`],
  ],
  care: [
    ["Context", (input) => input.context || input.goal],
    ["Action", (input) => input.task],
    ["Result", (input) => input.output || "Create a result that can be used immediately."],
    ["Example", (input) => `Optimize for ${input.audience || "a practical reader"} and avoid vague advice.`],
  ],
  rise: [
    ["Role", (input) => `You are a ${input.tone} AI assistant with strong domain judgment.`],
    ["Input", (input) => input.context || input.task],
    ["Steps", (input) => `First clarify the objective, then complete this task: ${input.task}`],
    ["Expectation", (input) => input.output || input.goal],
  ],
  era: [
    ["Expectation", (input) => input.output || `Deliver a ${input.length} response.`],
    ["Role", (input) => `Act as a ${input.tone} specialist.`],
    ["Action", (input) => `${input.task} so that ${input.goal}`],
  ],
  create: [
    ["Context", (input) => input.context || "Use the details provided by the user."],
    ["Role", (input) => `Act as a senior ${input.tone} collaborator.`],
    ["Example", (input) => `Aim the response at ${input.audience || "the intended audience"}.`],
    ["Action", (input) => input.task],
    ["Tone", (input) => `Use a ${input.tone} tone.`],
    ["Expectation", (input) => input.output || `Return a ${input.length}, structured answer.`],
  ],
  trace: [
    ["Task", (input) => input.task],
    ["Role", (input) => `Act as an expert for ${input.audience || "the user"}.`],
    ["Audience", (input) => input.audience || "General professional audience"],
    ["Context", (input) => input.context || input.goal],
    ["Expectation", (input) => input.output || `Use ${input.tone} language and be ${input.length}.`],
  ],
  roses: [
    ["Role", (input) => `Act as a ${input.tone} expert.`],
    ["Objective", (input) => input.goal],
    ["Scenario", (input) => input.context || input.task],
    ["Expected solution", (input) => input.output || "Provide the best practical solution."],
    ["Steps", () => "Break the work into clear, actionable steps."],
  ],
  spark: [
    ["Situation", (input) => input.context || input.goal],
    ["Problem", (input) => input.task],
    ["Aim", (input) => input.goal],
    ["Response", (input) => input.output || `Create a ${input.length} response.`],
    ["Knowledge", (input) => `Assume the audience is ${input.audience || "smart but busy"}.`],
  ],
};

function clean(value?: string) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function makeTitle(task: string) {
  const compact = clean(task);
  if (!compact) return "Generated AI prompt";
  return compact.length > 58 ? `${compact.slice(0, 55).trim()}...` : compact;
}

export function generateAiPrompt(input: PromptGeneratorInput): PromptGeneratorResult {
  const normalized: PromptGeneratorInput = {
    ...input,
    task: clean(input.task),
    goal: clean(input.goal),
    context: clean(input.context),
    audience: clean(input.audience),
    output: clean(input.output),
  };

  if (!normalized.task || !normalized.goal) {
    throw new Error("Add a task and goal before generating a prompt.");
  }

  const sections = frameworkSections[normalized.framework];
  const body = sections
    .map(([label, getter]) => `## ${label}\n${getter(normalized)}`)
    .join("\n\n");
  const guardrails = [
    "- Ask one clarifying question first if critical details are missing.",
    "- Do not invent facts, sources, metrics, or constraints.",
    "- Prefer concrete examples, structured output, and practical next steps.",
  ].join("\n");
  const prompt = [
    `# ${frameworkNames[normalized.framework]} Prompt: ${makeTitle(normalized.task)}`,
    body,
    `## Style\nUse a ${normalized.tone} tone. Keep the response ${normalized.length}.`,
    `## Guardrails\n${guardrails}`,
  ].join("\n\n");
  const words = prompt.match(/\b[\w'-]+\b/g) ?? [];
  const characterCount = prompt.length;

  return {
    title: makeTitle(normalized.task),
    prompt,
    framework: normalized.framework,
    tone: normalized.tone,
    length: normalized.length,
    sections: sections.length + 2,
    wordCount: words.length,
    characterCount,
    tokenEstimate: Math.ceil(characterCount / 4),
  };
}

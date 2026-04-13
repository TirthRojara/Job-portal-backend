export type Mode =
  | "GENERATE_FROM_SKILLS"
  | "GENERATE_FROM_PROMPT"
  | "OPTIMIZE"
  | "EDIT_WITH_PROMPT";

export interface Input {
  summary?: string;
  skills?: string[];
}

export interface ProcessedInput {
  cleanText: string;
  skills: string[];
  lines: number;
  wordLimit: number;
  mode: Mode;
  summaryPart?: string;
  promptPart?: string;
}


import { GenerateJobPayload } from './ai.types';

export function buildJobPrompt(input: GenerateJobPayload) {
    const { prompt, title, description, responsibilities, requirements } = input;

    return `
You are an expert recruiter.

Your task is to generate or improve a job post.

User Prompt:
${prompt || 'Not provided'}

Existing Data:
Title: ${title || 'Not provided'}
Description: ${description || 'Not provided'}
Responsibilities: ${responsibilities || 'Not provided'}
Requirements: ${requirements || 'Not provided'}

Rules:
- Always prioritize user prompt
- If prompt says modify specific field, only modify that field
- If prompt does not restrict, you can improve all fields
- If no prompt, optimize existing fields
- If nothing provided, generate a generic job post

Formatting Rules:
- Tone: professional and impactful
- Description: 100-150 words (max 350)
- Responsibilities: 5-7 points (max 15)
- Requirements: 5-7 points (max 15)
- Use "-" for each point and new line

VERY IMPORTANT:
Return output STRICTLY in this JSON format:

{
  "title": "...",
  "description": "...",
  "responsibilities": "...",
  "requirements": "..."
}

Do NOT return anything else.
`;
}

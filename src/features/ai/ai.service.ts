// modules/ai/ai.service.ts

import { getAI } from '~/globals/cores/gemini/gemini.provider';
import { GenerateJobPayload, Input, JobField, Mode, ProcessedInput } from './ai.types';
import { CustomErrorException } from '~/globals/cores/error.cores';
import { buildJobPrompt } from './ai.prompt';

class AiService {
    private MAX_LINES = 10;
    private DEFAULT_LINES = 3;

    // -------------------- MAIN STREAM FUNCTION FOR CANDIDATE SUMMARY --------------------

    public async *generateCandidateSummaryStream(input: Input) {
        try {
            const ai = await getAI();

            const processed = this.preprocess(input);
            const prompt = this.buildPrompt(processed);

            const stream = await ai.models.generateContentStream({
                // model: 'gemini-3-flash-preview',
                // model: 'gemini-3.1-flash-lite-preview',
                model: 'gemini-2.5-flash',
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });

            for await (const chunk of stream) {
                const text = chunk?.text;
                if (text && text.trim()) {
                    const clean = text
                        .replace(/\*\*/g, '') // remove bold
                        .replace(/#+\s*/g, '') // remove headings
                        .replace(/```/g, ''); // remove code blocks

                    // console.log('AI CHUNK:', { clean });
                    yield clean;
                }
            }
        } catch (error: any) {
            console.error('AI STREAM ERROR:', error);

            // 🔥 Handle quota error
            if (error?.status === 429) {
                throw new CustomErrorException('AI usage limit reached. Please try again later.', 429);
            }

            // 🔥 Generic fallback
            throw new CustomErrorException('Failed to generate summary. Please try again.', 500);
        }
    }

    // -------------------- PREPROCESS --------------------

    private preprocess(input: Input): ProcessedInput {
        let text = (input.summary || '').trim();
        let skills = input.skills || [];

        // limit words (extra safety)
        text = this.limitWords(text, 500);

        // extract lines
        let lines = this.extractLines(text);
        if (!lines) lines = this.DEFAULT_LINES;
        if (lines > this.MAX_LINES) lines = this.MAX_LINES;

        const wordLimit = lines * 18;

        const modeData = this.detectMode(text);

        console.log({ modeData });

        return {
            cleanText: text,
            skills,
            lines,
            wordLimit,
            ...modeData
        };
    }

    // -------------------- MODE DETECTION --------------------

    private detectMode(text: string): {
        mode: Mode;
        summaryPart?: string;
        promptPart?: string;
    } {
        const lower = text.toLowerCase();

        const instructionKeywords = [
            'make',
            'improve',
            'optimize',
            'rewrite',
            'shorten',
            'expand',
            'professional',
            'better'
        ];

        const hasInstruction = instructionKeywords.some((k) => lower.includes(k));

        const wordCount = text.split(/\s+/).length;

        if (!text) {
            return { mode: 'GENERATE_FROM_SKILLS' };
        }

        if (wordCount < 25) {
            return { mode: 'GENERATE_FROM_PROMPT' };
        }

        if (hasInstruction) {
            const parts = text.split(':');

            if (parts.length > 1) {
                return {
                    mode: 'EDIT_WITH_PROMPT',
                    promptPart: parts[0],
                    summaryPart: parts.slice(1).join(':')
                };
            }

            return {
                mode: 'EDIT_WITH_PROMPT',
                promptPart: text,
                summaryPart: ''
            };
        }

        return {
            mode: 'OPTIMIZE',
            summaryPart: text
        };
    }

    // -------------------- EXTRACT LINES --------------------

    private extractLines(text: string): number | null {
        const match = text.match(/(\d+)\s*line/);
        if (!match) return null;
        return parseInt(match[1], 10);
    }

    // -------------------- LIMIT WORDS --------------------

    private limitWords(text: string, max: number): string {
        const words = text.split(/\s+/);
        return words.slice(0, max).join(' ');
    }

    // -------------------- PROMPT BUILDER --------------------

    private buildPrompt(data: ProcessedInput): string {
        const { mode, cleanText, skills, lines, wordLimit, summaryPart, promptPart } = data;

        const OUTPUT_RULES = `
Output Rules:
- Return ONLY the final summary
- Do NOT include explanations or extra sections
- Do NOT include headings
- Do NOT use markdown (no **, no #, no bullet points)
- Plain text only
`;

        switch (mode) {
            case 'GENERATE_FROM_SKILLS':
                return `
You are an expert recruiter.

Create a professional and impactful candidate summary.

Skills:
${skills.join(', ') || 'Not provided'}

Requirements:
- Write approximately ${lines} lines (~${wordLimit} words)
- Keep it concise and strong
- Tone: professional and impactful

${OUTPUT_RULES}
`;

            case 'GENERATE_FROM_PROMPT':
                return `
You are an expert recruiter.

Create a candidate summary based on the instruction:

${cleanText}

Skills:
${skills.join(', ') || 'Not provided'}

Requirements:
- Use the provided skills when generating the summary
- Highlight relevant technical strengths
- Write approximately ${lines} lines (~${wordLimit} words)
- Tone: professional and impactful

${OUTPUT_RULES}
`;

            case 'OPTIMIZE':
                return `
You are an expert recruiter.

Improve the following candidate summary:

${summaryPart}

Requirements:
- Keep original meaning
- Make it more professional and impactful
- Limit to ${lines} lines (~${wordLimit} words)

${OUTPUT_RULES}
`;

            case 'EDIT_WITH_PROMPT':
                return `
You are an expert recruiter.

Modify the summary based on instruction:

Instruction:
${promptPart}

Summary:
${summaryPart}

Requirements:
- Follow instruction carefully
- Tone: professional and impactful
- Limit to ${lines} lines (~${wordLimit} words)

${OUTPUT_RULES}
`;

            default:
                return '';
        }
    }

    // ------------------ Recruiter Job Post Generation -------------------

    public async *generateJobStream(input: GenerateJobPayload) {
        const ai = await getAI();

        const prompt = buildJobPrompt(input);

        const stream = await ai.models.generateContentStream({
            // model: 'gemini-3-flash-preview',
            // model: 'gemini-3.1-flash-lite-preview',
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });

        let buffer = '';

        for await (const chunk of stream) {
            const text = chunk?.text;
            if (!text) continue;

            buffer += text;

            // Try parsing partial JSON safely
            const parsed = this.tryParseJSON(buffer);

            console.log('STREAM CHUNK:', { text, parsed });

            if (parsed) {
                // stream field by field
                yield* this.streamFields(parsed);
                buffer = ''; // reset after success
            }
        }
    }

    // private tryParseJSON(text: string) {
    //     try {
    //         return JSON.parse(text);
    //     } catch {
    //         return null;
    //     }
    // }

    private tryParseJSON(text: string) {
        try {
            const cleaned = text
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

            return JSON.parse(cleaned);
        } catch {
            return null;
        }
    }

    private async *streamFields(data: Record<string, string>) {
        const fields: JobField[] = ['title', 'description', 'responsibilities', 'requirements'];

        for (const field of fields) {
            const value = data[field];
            if (!value) continue;

            // chunking text manually (simulate streaming per field)
            const chunks = this.splitIntoChunks(value, 20);

            for (const chunk of chunks) {
                yield JSON.stringify({
                    field,
                    text: chunk
                });
            }
        }
    }

    private splitIntoChunks(text: string, size: number) {
        const words = text.split(' ');
        const chunks: string[] = [];

        for (let i = 0; i < words.length; i += size) {
            chunks.push(words.slice(i, i + size).join(' ') + ' ');
        }

        return chunks;
    }
}

export const aiservice: AiService = new AiService();

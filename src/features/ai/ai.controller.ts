import { Request, Response } from 'express';
import { aiservice } from './ai.service';
import { Readable } from 'stream';
import { GenerateJobPayload } from './ai.types';

class AiController {
    // public async generateCandidateSummary(req: Request, res: Response) {
    //     const { summary, skills }: { summary: string; skills: string[] } = req.body;

    //     res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    //     res.setHeader('Transfer-Encoding', 'chunked');
    //     res.setHeader('Cache-Control', 'no-cache');
    //     res.setHeader('Connection', 'keep-alive');

    //     res.flushHeaders();

    //     const stream = aiservice.generateCandidateSummaryStream({
    //         summary,
    //         skills
    //     });

    //     for await (const chunk of stream) {
    //         res.write(chunk);
    //         // res.flush?.();
    //         await new Promise((resolve) => setTimeout(resolve, 0));
    //     }

    //     res.end();
    // }

    // public async generateCandidateSummary(req: Request, res: Response) {
    //     try {
    //         const { summary, skills } = req.body;

    //         res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    //         res.setHeader('Transfer-Encoding', 'chunked');
    //         res.setHeader('Cache-Control', 'no-cache');
    //         res.setHeader('Connection', 'keep-alive');

    //         res.flushHeaders();

    //         const stream = aiservice.generateCandidateSummaryStream({
    //             summary,
    //             skills
    //         });

    //         for await (const chunk of stream) {
    //             res.write(chunk);
    //             await new Promise((r) => setTimeout(r, 0));
    //         }

    //         res.end();
    //     } catch (error: any) {
    //         console.error('STREAM ERROR:', error);

    //         // 🔥 IMPORTANT: check if headers already sent
    //         if (!res.headersSent) {
    //             res.status(500).json({
    //                 message: error.message || 'Streaming failed'
    //             });
    //         } else {
    //             // ✅ If streaming already started → just end
    //             res.end();
    //         }
    //     }
    // }

    // public async generateCandidateSummary(req: Request, res: Response) {
    //     try {
    //         const { summary, skills } = req.body;

    //         res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    //         res.setHeader('Cache-Control', 'no-cache');
    //         res.setHeader('Connection', 'keep-alive');
    //         res.setHeader('Transfer-Encoding', 'chunked');

    //         const stream = aiservice.generateCandidateSummaryStream({
    //             summary,
    //             skills
    //         });

    //         const readable = Readable.from(stream);

    //         readable.on('data', (chunk) => {
    //             res.write(chunk);
    //         });

    //         readable.on('end', () => {
    //             res.end();
    //         });

    //         readable.on('error', (err) => {
    //             console.error('STREAM ERROR:', err);

    //             if (!res.headersSent) {
    //                 res.status(500).json({ message: err.message || 'Streaming failed' });
    //             } else {
    //                 res.end(); // 🔥 important
    //             }
    //         });
    //     } catch (error: any) {
    //         console.error('CONTROLLER ERROR:', error);

    //         if (!res.headersSent) {
    //             res.status(500).json({ message: error.message });
    //         } else {
    //             res.end();
    //         }
    //     }
    // }

    public async generateCandidateSummary(req: Request, res: Response) {
        const { summary, skills } = req.body;

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = aiservice.generateCandidateSummaryStream({
            summary,
            skills
        });

        try {
            for await (const chunk of stream) {
                res.write(`data: ${chunk}\n\n`); // 🔥 SSE format
                // await new Promise(r => setTimeout(r, 500));  // only for testing stream
            }

            res.write('data: [DONE]\n\n');
            res.end();
        } catch (err: any) {
            console.error('STREAM ERROR:', err);
            res.write(`data: ERROR: ${err.message}\n\n`);
            res.end();
        }
    }

    public async generateJobWithAI(req: Request, res: Response) {
        try {
            const payload: GenerateJobPayload = req.body;

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Transfer-Encoding', 'chunked');

            const stream = aiservice.generateJobStream(payload);

            for await (const chunk of stream) {

                // console.log('chunk:', chunk , '\n');

                res.write(chunk + '\n'); // newline-separated JSON
                await new Promise(r => setTimeout(r, 150));
            }

            res.end();
        } catch (error) {
            console.error('Job AI Error:', error);
            res.status(500).end('AI generation failed');
        }
    }
}

export const aicontroller: AiController = new AiController();

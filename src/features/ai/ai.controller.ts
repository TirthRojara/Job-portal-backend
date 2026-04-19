import { Request, Response } from 'express';
import { aiservice } from './ai.service';
import { Readable } from 'stream';
import { GenerateJobPayload } from './ai.types';

class AiController {
    public async generateCandidateSummary(req: Request, res: Response) {
        const { summary, skills } = req.body;

        const stream = aiservice.generateCandidateSummaryStream({
            summary,
            skills
        });

        let started = false;

        try {
            for await (const chunk of stream) {
                // ✅ set headers ONLY when first chunk arrives
                if (!started) {
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');
                    started = true;
                }

                res.write(`data: ${chunk}\n\n`);
            }

            res.write('data: [DONE]\n\n');
            res.end();
        } catch (err: any) {
            console.error('STREAM ERROR:', err);

            // ✅ If error happens BEFORE streaming starts → send proper status
            if (!started) {
                return res.status(err.statusCode || 500).json({
                    message: err.message
                });
            }

            // ❌ If stream already started → send error via SSE
            res.write(
                `data: ${JSON.stringify({
                    error: true,
                    message: err.message
                })}\n\n`
            );

            res.end();
        }
    }

    // public async generateCandidateSummary(req: Request, res: Response) {
    //     const { summary, skills } = req.body;

    //     res.setHeader('Content-Type', 'text/event-stream');
    //     res.setHeader('Cache-Control', 'no-cache');
    //     res.setHeader('Connection', 'keep-alive');

    //     const stream = aiservice.generateCandidateSummaryStream({
    //         summary,
    //         skills
    //     });

    //     try {
    //         for await (const chunk of stream) {
    //             res.write(`data: ${chunk}\n\n`); // 🔥 SSE format
    //             // await new Promise(r => setTimeout(r, 500));  // only for testing stream
    //         }

    //         res.write('data: [DONE]\n\n');
    //         res.end();
    //     } catch (err: any) {
    //         console.error('STREAM ERROR:', err);
    //         res.write(`data: ERROR: ${err.message}\n\n`);
    //         res.end();
    //     }
    // }

    public async generateJobWithAI(req: Request, res: Response) {
        try {
            const payload: GenerateJobPayload = req.body;

            const stream = aiservice.generateJobStream(payload);

            let started = false;

            for await (const chunk of stream) {
                // ✅ set headers ONLY when first chunk arrives
                if (!started) {
                    res.setHeader('Content-Type', 'text/event-stream');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');
                    started = true;
                }

                res.write(`data: ${chunk}\n\n`);
                await new Promise((r) => setTimeout(r, 150));
            }

            res.write('data: [DONE]\n\n');
            res.end();
        } catch (error: any) {
            console.error('Job AI Error:', error);

            // ✅ If error happens BEFORE stream starts
            if (!res.headersSent) {
                return res.status(error.status || 500).json({
                    message: error.message
                });
            }

            // ❌ If stream already started → fallback to SSE error
            res.write(
                `data: ${JSON.stringify({
                    error: true,
                    message: error.message
                })}\n\n`
            );

            res.end();
        }
    }

    // public async generateJobWithAI(req: Request, res: Response) {
    //     try {
    //         const payload: GenerateJobPayload = req.body;

    //         // res.setHeader('Content-Type', 'application/json');
    //         res.setHeader('Content-Type', 'text/event-stream');
    //         res.setHeader('Transfer-Encoding', 'chunked');

    //         const stream = aiservice.generateJobStream(payload);

    //         for await (const chunk of stream) {
    //             console.log('chunk:', chunk, '\n');

    //             res.write(chunk + '\n'); // newline-separated JSON
    //             await new Promise((r) => setTimeout(r, 150));
    //         }

    //         res.end();
    //     } catch (error) {
    //         console.error('Job AI Error:', error);
    //         res.status(500).end('AI generation failed');
    //     }
    // }
}

export const aicontroller: AiController = new AiController();

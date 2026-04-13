import { Request, Response } from "express";
import { aiservice } from "./ai.service";

class AiController {
    public async generateCandidateSummary(req: Request, res: Response) {
        const { summary, skills }: { summary: string; skills: string[] } = req.body;

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        const stream = aiservice.generateCandidateSummaryStream({
            summary,
            skills
        });

        for await (const chunk of stream) {
            res.write(chunk);
        }

        res.end();
    }
}

export const aicontroller: AiController = new AiController();

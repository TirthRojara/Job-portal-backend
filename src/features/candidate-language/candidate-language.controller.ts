import HTTP_STATUS from '~/globals/constants/http.constant';
import { candidateLanguageService } from './candidate-language.service';
import { Request, Response } from 'express';

class CandidateLanguageController {
    public async create(req: any, res: any) {
        const candidateLanguage = await candidateLanguageService.create(req.body, req.currentUser);

        return res.status(HTTP_STATUS.CREATED).json({
            message: 'Created candidate language successfully',
            data: candidateLanguage
        });
    }

    public async readAll(req: any, res: any) {
        const candidateLanguage = await candidateLanguageService.readAll();

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get all candidate language successfully',
            data: candidateLanguage
        });
    }

    public async readMyLanguage(req: any, res: any) {
        const candidateLanguage = await candidateLanguageService.readMyLanguage(req.currentUser);

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get my candidate language successfully',
            data: candidateLanguage
        });
    }

    public async readLanguageById(req: Request, res: Response) {
        const jobId = parseInt(req.params.jobId);
        const candidateProfileId = parseInt(req.params.candidateProfileId);

        const candidateLanguage = await candidateLanguageService.readLanguageById(candidateProfileId, jobId);

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get candidate language successfully',
            data: candidateLanguage
        });
    }

    public async updateLevel(req: any, res: any) {
        const candidateLanguage = await candidateLanguageService.updateLevel(
            req.currentUser,
            req.params.languageName,
            req.body.level
        );

        return res.status(HTTP_STATUS.OK).json({
            message: 'Update my candidate language level successfully',
            data: candidateLanguage
        });
    }

    public async remove(req: any, res: any) {
        const candidateLanguage = await candidateLanguageService.remove(req.currentUser, req.params.languageName);

        return res.status(HTTP_STATUS.OK).json({
            message: 'Remove my candidate language successfully',
            data: candidateLanguage
        });
    }
}

export const candidateLanguageController: CandidateLanguageController = new CandidateLanguageController();

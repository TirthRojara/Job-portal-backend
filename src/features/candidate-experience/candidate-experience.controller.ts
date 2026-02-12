import { Request, Response } from 'express';
import { candidateExperienceService } from './candidate-experience.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class CandidateExperienceController {
    public async create(req: Request, res: Response) {
        const candidateExperience = await candidateExperienceService.create(req.body, req.currentUser.id);

        return res.status(HTTP_STATUS.CREATED).json({
            message: 'Create candidate experience successfully',
            data: candidateExperience
        });
    }

    public async readAll(req: Request, res: Response) {
        const candidateExperience = await candidateExperienceService.readAll();

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get all candidate experience successfully',
            data: candidateExperience
        });
    }

    public async readMyExperience(req: Request, res: Response) {
        const candidateExperience = await candidateExperienceService.readMyExperience(req.currentUser.id);

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get my candidate experience successfully',
            data: candidateExperience
        });
    }

    public async readExperienceById(req: Request, res: Response) {
        const jobId = parseInt(req.params.jobId);
        const candidateProfileId = parseInt(req.params.candidateProfileId);

        const candidateExperience = await candidateExperienceService.readExperienceById(candidateProfileId, jobId);

        return res.status(HTTP_STATUS.OK).json({
            message: 'get candidate experience successfully',
            data: candidateExperience
        });
    }

    public async update(req: Request, res: Response) {
        const candidateExperience = await candidateExperienceService.update(
            req.body,
            parseInt(req.params.id),
            req.currentUser.id
        );

        return res.status(HTTP_STATUS.OK).json({
            message: 'Update my candidate experience successfully',
            data: candidateExperience
        });
    }

    public async remove(req: Request, res: Response) {
        await candidateExperienceService.remove(parseInt(req.params.id), req.currentUser.id);

        return res.status(HTTP_STATUS.OK).json({
            message: 'Delete my candidate experience successfully'
        });
    }
}

export const candidateExperienceController: CandidateExperienceController = new CandidateExperienceController();

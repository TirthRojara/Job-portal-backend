import { Express, NextFunction, Request, Response } from 'express';
import { candidateProfileService } from './candidate-profile.service';
import HTTP_STATUS from '~/globals/constants/http.constant';
import path from 'path';

class CandidateProfileController {
    public async create(req: Request, res: Response, next: NextFunction) {
        console.log('req.files =', req.files);

        const candidateProfile = await candidateProfileService.create(
            req.body,
            req.currentUser,
            req.files as Express.Multer.File[]
        );

        return res.status(HTTP_STATUS.CREATED).json({
            message: 'Create candidate profilel successfully',
            data: candidateProfile
        });
    }

    public async readAll(req: Request, res: Response) {
        const candidates = await candidateProfileService.readAll();

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get all candidate profilels successfully',
            data: candidates
        });
    }

    public async readOne(req: Request, res: Response) {
        const candidate = await candidateProfileService.readOne(req.currentUser.id);

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get one candidate profilel successfully',
            data: candidate
        });
    }

    // for admin
    public async readById(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const candidate = await candidateProfileService.readById(id);

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get one candidate profilel successfully',
            data: candidate
        });
    }

    public async update(req: Request, res: Response) {
        const candidate = await candidateProfileService.update(
            req.currentUser.id,
            req.body,
            req.files as Express.Multer.File[]
        );

        return res.status(HTTP_STATUS.OK).json({
            message: 'Update candidate profile successfully',
            data: candidate
        });
    }

    // public async remove(req: Request, res: Response) {
    //     await candidateProfileService.remove(req.currentUser.id);

    //     return res.status(HTTP_STATUS.OK).json({
    //         message: 'Delete candidate profile successfully'
    //     });
    // }

    public async viewResumeForCandidate(req: Request, res: Response) {
        const resumePath = await candidateProfileService.viewResumeForCandidate(req.currentUser);

        const backendFileName = path.basename(resumePath);
        const fileName = backendFileName.replace(/^\d+-\d+-/, '');

        res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.setHeader('Content-Disposition', `${fileName}`);
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

        return res.sendFile(resumePath);
    }

    public async viewResumeForRecruiter(req: Request, res: Response) {
        const resumePath = await candidateProfileService.viewResumeForRecruiter(
            req.currentUser,
            Number(req.params.candidateId),
            req.body.companyId
        );

        return res.sendFile(resumePath);
    }
}

export const candidateProfileController: CandidateProfileController = new CandidateProfileController();

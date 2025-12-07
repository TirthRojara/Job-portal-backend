import { Request, Response } from 'express';
import { jobBenefitService } from './job-benefit.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class JobBenefitController {
    public async getAllBenefitList(req: Request, res: Response) {
        const jobBenefit = await jobBenefitService.getAllBenefitList();

        return res.status(HTTP_STATUS.CREATED).json({
            message: 'get all job benefit list successfully',
            data: jobBenefit
        });
    }

    public async create(req: Request, res: Response) {
        const jobBenefit = await jobBenefitService.create(
            parseInt(req.params.jobId),
            req.body.benefitName,
            req.currentUser
        );

        return res.status(HTTP_STATUS.CREATED).json({
            message: 'Created job benefit successfully',
            data: jobBenefit
        });
    }

    public async read(req: Request, res: Response) {
        const jobBenefit = await jobBenefitService.read(parseInt(req.params.jobId));

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get job benefit successfully',
            data: jobBenefit
        });
    }

    public async remove(req: Request, res: Response) {
        const jobBenefit = await jobBenefitService.remove(
            parseInt(req.params.jobId),
            req.params.benefitName,
            req.currentUser
        );

        return res.status(HTTP_STATUS.OK).json({
            message: 'Delete job benefit successfully'
        });
    }
}

export const jobBenefitController: JobBenefitController = new JobBenefitController();

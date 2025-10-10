import HTTP_STATUS from '~/globals/constants/http.constant';
import { applyService } from './apply.service';
import { Request, Response } from 'express';

class ApplyController {
  public async create(req: Request, res: Response) {
    const apply = await applyService.create(parseInt(req.params.jobId), req.currentUser);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created job successfully',
      data: apply
    });
  }

  public async readMyApplicationsForCandidate(req: Request, res: Response) {
    let { page = 1, limit = 5 } = req.query;

    const { apply, totalCount, totalPages } = await applyService.readMyApplicationsForCandidate(
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      },
      req.currentUser
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all my job applicants detail successfully',
      pagination: {
        totalCount,
        currentPage: page,
        totalPages
      },
      data: apply
    });
  }
  public async readMyApplicationsForRECRUITER(req: Request, res: Response) {
    let { page = 1, limit = 5 } = req.query;

    const { apply, totalCount, totalPages } = await applyService.readMyApplicationsForRECRUITER(
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      },
      parseInt(req.params.jobId),
      parseInt(req.params.companyId),
      req.currentUser
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all my job applicants detail successfully',
      pagination: {
        totalCount,
        currentPage: page,
        totalPages
      },
      jobId: req.params.jobId,
      data: apply
    });
  }

  public async updateStatus(req: Request, res: Response) {
    const apply = await applyService.updateStatus(
      req.body,
      parseInt(req.params.jobId),
      parseInt(req.params.companyId),
      req.currentUser
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Update job status successfully',
      data: apply
    });
  }
}

export const applyController: ApplyController = new ApplyController();

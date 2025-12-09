import { Request, Response } from 'express';
import { jobService } from './job.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class Jobcontroller {
  public async create(req: Request, res: Response) {
    const job = await jobService.create(
      req.body,
      req.currentUser,
      req.recruiterPackage,
      parseInt(req.params.companyId)
    );

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created job successfully',
      data: job
    });
  }

  public async readAll(req: Request, res: Response) {
    let { page = 1, limit = 5, filter = '', salaryMin = 0, JobStatus = '' } = req.query;

    const { job, totalCount, totalPages } = await jobService.readAll({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      filter: filter as string,
      salaryMin: parseInt(salaryMin as string),
      JobStatus: JobStatus as string
    });

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all job detail successfully',
      pagination: {
        totalCount,
        currentPage: page,
        totalPages
      },
      data: job
    });
  }

  public async readAllForRecruiter(req: Request, res: Response) {
    let { page = 1, limit = 5, filter = '', salaryMin = 0 } = req.query;

    const { job, totalCount, totalPages } = await jobService.readAllForRecruiter(
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        filter: filter as string,
        salaryMin: parseInt(salaryMin as string)
      },
      req.currentUser
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all my companies job detail successfully',
      pagination: {
        totalCount,
        currentPage: page,
        totalPages
      },
      data: job
    });
  }

  public async readOne(req: Request, res: Response) {
    const job = await jobService.readOne(parseInt(req.params.id), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get job successfully',
      data: job
    });
  }

  public async update(req: Request, res: Response) {
    const job = await jobService.update(
      parseInt(req.params.id),
      parseInt(req.params.companyId),
      req.currentUser,
      req.body
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Updated job successfully',
      data: job
    });
  }

  public async updateStatus(req: Request, res: Response) {
    const job = await jobService.updateStatus(
      parseInt(req.params.id),
      parseInt(req.params.companyId),
      req.currentUser,
      req.body.status
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Updated job status successfully',
      data: job
    });
  }

  public async remove(req: Request, res: Response) {
    await jobService.remove(parseInt(req.params.id), parseInt(req.params.companyId), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Remove job successfully'
    });
  }

  public async getJobView(req: Request, res: Response) {
    const job = await jobService.getJobView(parseInt(req.params.jobId), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'get job views successfully',
      data: job
    });
  }

}

export const jobController: Jobcontroller = new Jobcontroller();

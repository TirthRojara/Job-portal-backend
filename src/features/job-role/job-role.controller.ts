import { Request, Response } from 'express';
import { jobRoleService } from './job-role.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class JobRoleController {
  public async create(req: Request, res: Response) {
    const jobRole = await jobRoleService.create(req.body.name);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create job-role successfully',
      data: jobRole
    });
  }

  public async readAll(req: Request, res: Response) {
    let { page = 1, limit = 5, filter = '' } = req.query;

    const { jobRole, totalCount, totalPages } = await jobRoleService.readAll({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      filter: filter as string
    });

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all job roles successfully',
      pagination: {
        totalCount,
        currentPage: page,
        totalPages
      },
      data: jobRole
    });
  }

  public async remove(req: Request, res: Response) {
    await jobRoleService.remove(parseInt(req.params.jobRoleId));

    return res.status(HTTP_STATUS.CREATED).json({
      message: `Delete job-role with id: ${req.params.jobRoleId} successfully`,
    });
  }
}

export const jobRoleController: JobRoleController = new JobRoleController();

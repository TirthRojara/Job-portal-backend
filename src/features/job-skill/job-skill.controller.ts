import { Request, Response } from 'express';
import { jobSkillService } from './job-skill.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class JobSkillController {
  public async create(req: Request, res: Response) {
    const jobskill = await jobSkillService.create(
      parseInt(req.params.jobId),
      parseInt(req.params.skillId),
      req.currentUser
    );

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created job skill successfully',
      data: jobskill
    });
  }

  public async read(req: Request, res: Response) {
    const jobskill = await jobSkillService.read(parseInt(req.params.jobId));

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get job skill successfully',
      data: jobskill
    });
  }

  public async remove(req: Request, res: Response) {
    await jobSkillService.remove(parseInt(req.params.jobId), parseInt(req.params.skillId), req.currentUser);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Remove job skill successfully'
    });
  }
}

export const jobSkillController: JobSkillController = new JobSkillController();

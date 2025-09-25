import { Request, Response } from 'express';
import { candidateEducationService } from './candidate-education.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class CandidateEducationController {
  public async create(req: Request, res: Response) {
    const candidateEducation = await candidateEducationService.create(req.body, req.currentUser);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created candidate education successfully',
      data: candidateEducation
    });
  }

  public async readAll(req: Request, res: Response) {
    const candidateEducation = await candidateEducationService.readAll();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all candidate education successfully',
      data: candidateEducation
    });
  }

  public async readMyEducation(req: Request, res: Response) {
    const candidateEducation = await candidateEducationService.readMyEducation(req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get my candidate education successfully',
      data: candidateEducation
    });
  }

  public async update(req: Request, res: Response) {
    const candidateEducation = await candidateEducationService.update(
      parseInt(req.params.id),
      req.body,
      req.currentUser
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Update my candidate education successfully',
      data: candidateEducation
    });
  }

  public async remove(req: Request, res: Response) {
    const candidateEducation = await candidateEducationService.remove(
      parseInt(req.params.id),
      req.currentUser
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete my candidate education successfully',
      data: candidateEducation
    });
  }
}

export const candidateEducationController: CandidateEducationController = new CandidateEducationController();

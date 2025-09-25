import { NextFunction, Request, Response } from 'express';
import { candidateProfileService } from './candidate-profile.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class CandidateProfileController {
  public async create(req: Request, res: Response, next: NextFunction) {
    const candidateProfile = await candidateProfileService.create(req.body, req.currentUser);

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
    const id = parseInt(req.params.id)
    const candidate = await candidateProfileService.readById(id);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get one candidate profilel successfully',
      data: candidate
    });
  }

  public async update(req: Request, res: Response) {
    const candidate = await candidateProfileService.update(req.currentUser.id, req.body);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Update candidate profile successfully',
      data: candidate
    });
  }

  public async remove(req: Request, res: Response) {
    await candidateProfileService.remove(req.currentUser.id);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete candidate profile successfully'
    });
  }
}

export const candidateProfileController: CandidateProfileController = new CandidateProfileController();

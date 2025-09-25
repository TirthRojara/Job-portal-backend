import { Request, Response } from 'express';
import { candidateSkillService } from './candidate-skill.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class CandidateSkillController {
  public async getAllSkill(req: Request, res: Response) {
    const skills = await candidateSkillService.getAllSkill();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all skills successfully',
      data: skills
    });
  }

  public async create(req: Request, res: Response) {
    const candidateSkill = await candidateSkillService.create(parseInt(req.body.skillId), req.currentUser);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create candidate skill successfully',
      data: candidateSkill
    });
  }

  public async readAllUserSkill(req: Request, res: Response) {
    const candidateSkill = await candidateSkillService.readAllUserSkill();

    return res.status(HTTP_STATUS.OK).json({
      message: 'get all candidate skill successfully',
      data: candidateSkill
    });
  }

  public async readMySkill(req: Request, res: Response) {
    const candidateSkill = await candidateSkillService.readMySkill(req.currentUser.id);

    return res.status(HTTP_STATUS.OK).json({
      message: 'get my candidate skill successfully',
      data: candidateSkill
    });
  }

  public async remove(req: Request, res: Response) {
    await candidateSkillService.remove(parseInt(req.body.skillId), req.currentUser.id)

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete my candidate skill successfully',
    });
  }
}

export const candidateSkillController: CandidateSkillController = new CandidateSkillController();

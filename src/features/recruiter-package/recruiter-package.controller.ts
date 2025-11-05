import { Request, Response } from "express";
import HTTP_STATUS from "~/globals/constants/http.constant";
import { recruiterPackageService } from "./recruiter-package.service";

class RecruiterPackageController {
  public async create(req: Request, res: Response) {
    
    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created package successfully',
      // data: 
    });
  }
}

export const recruiterPackageController: RecruiterPackageController = new RecruiterPackageController();

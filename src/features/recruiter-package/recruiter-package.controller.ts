import { Request, Response } from "express";
import HTTP_STATUS from "~/globals/constants/http.constant";
import { recruiterPackageService } from "./recruiter-package.service";

class RecruiterPackageController {
  public async create(req: Request, res: Response) {
    const recruiterPackage = await recruiterPackageService.create(parseInt(req.params.packageId), req.currentUser)

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created package successfully',
      data: recruiterPackage
    });
  }
}

export const recruiterPackageController: RecruiterPackageController = new RecruiterPackageController();

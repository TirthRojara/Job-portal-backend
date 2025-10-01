import {  Request, Response } from 'express';
import { companyImageService } from './company-image.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class CompanyImageController {
  public async add(req: Request, res: Response) {
    
    await companyImageService.add(parseInt(req.params.companyId), req.currentUser, req.files as Express.Multer.File[]);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Add image to company successfully'
    });
  }

  public async readAll(req: Request, res: Response) {
    const companyImages = await companyImageService.readAll(parseInt(req.params.companyId));

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all company images successfully',
      data: companyImages
    });
  }

  public async remove(req: Request, res: Response) {
    await companyImageService.remove(
      parseInt(req.params.companyId),
      parseInt(req.params.companyImageId),
      req.currentUser
    );

    return res.status(HTTP_STATUS.OK).json({
      message: `Delete company image with imageId: ${req.params.companyImageId} successfully`,
    });
  }
}

export const companyImageController: CompanyImageController = new CompanyImageController();

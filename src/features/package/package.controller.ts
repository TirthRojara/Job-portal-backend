import { Request, Response } from 'express';
import { packageService } from './package.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class PackageController {
  public async create(req: Request, res: Response) {
    const pkg = await packageService.create(req.body);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created package successfully',
      data: pkg
    });
  }

  public async readAll(req: Request, res: Response) {
    const pkg = await packageService.readAll();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all package detail successfully',
      data: pkg
    });
  }

  public async readAllForRecruiter(req: Request, res: Response) {
    const pkg = await packageService.readAllForRecruiter();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all package detail successfully',
      data: pkg
    });
  }

  public async readOne(req: Request, res: Response) {
    const pkg = await packageService.readOne(parseInt(req.params.id));

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get package detail successfully',
      data: pkg
    });
  }

  public async readOneForRecruiter(req: Request, res: Response) {
    const pkg = await packageService.readOneForRecruiter(parseInt(req.params.id));

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get package detail successfully',
      data: pkg
    });
  }

  public async update(req: Request, res: Response) {
    const pkg = await packageService.update(parseInt(req.params.id), req.body);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Updated package successfully',
      data: pkg
    });
  }

  public async updateStatus(req: Request, res: Response) {
    const pkg = await packageService.updateStatus(parseInt(req.params.id), req.body.isActive);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Updated package active status successfully',
      data: pkg
    });
  }
}

export const packageController: PackageController = new PackageController();

import { Request, Response } from 'express';
import { companyIndustryService } from './company-industry.service';
import HTTP_STATUS from '~/globals/constants/http.constant';

class CompanyIndustryController {
  public async getAllIndustries(req: Request, res: Response) {
    const industries = await companyIndustryService.getAllIndustries();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all industry successfully',
      data: industries
    });
  }

  public async add(req: Request, res: Response) {
    const companyIndustry = await companyIndustryService.add(
      parseInt(req.params.industryId),
      parseInt(req.params.companyId),
      req.currentUser
    );

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Add industry to company successfully',
      data: companyIndustry
    });
  }

  public async getCompanyIndustry(req: Request, res: Response) {
    const companyIndustry = await companyIndustryService.getCompanyIndustry(parseInt(req.params.companyId));

    return res.status(HTTP_STATUS.OK).json({
      message: `Get industry of company with id: ${req.params.companyId} successfully`,
      data: companyIndustry
    });
  }

  public async remove(req: Request, res: Response) {
    await companyIndustryService.remove(
      parseInt(req.params.industryId),
      parseInt(req.params.companyId),
      req.currentUser
    );

    return res.status(HTTP_STATUS.OK).json({
      message: `Delete industry with id ${req.params.industryId} of company with id: ${req.params.companyId} successfully`,
    });
  }
}

export const companyIndustryController: CompanyIndustryController = new CompanyIndustryController();

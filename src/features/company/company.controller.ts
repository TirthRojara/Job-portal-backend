import { Request, Response } from 'express';
import { companyService } from './company.service';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { number } from 'joi';

class CompanyController {
  public async create(req: Request, res: Response) {
    const company = await companyService.create(req.body, req.currentUser.id);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create company successfully',
      date: company
    });
  }

  public async readAll(req: Request, res: Response) {
    let { page = 1, limit = 5, filter = '' } = req.query;

    // page = parseInt(page as string);
    // limit = parseInt(limit as string);

    // const companies = await companyService.readAll();
    // const companies = await companyService.readAllPagination(req.query.page as string, req.query.limit as string);
    // const { companies, totalCount } = await companyService.readAllPagination(page, limit);
    const { companies, totalCount, totalPages } = await companyService.readAllPagination({
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      filter: filter as string
    });

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all companies detail successfully',
      pagination: {
        totalCount,
        currentPage: page,
        totalPages
      },
      data: companies
    });
  }

  public async readAllIsApproved(req: Request, res: Response) {
    let { page = 1, limit = 5, filter = '' } = req.query;
    const isApproved = req.query.isApproved === 'true' ? true : false;

    const { companies, totalCount, totalPages } = await companyService.readAllIsApproved(
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        filter: filter as string
      },
      isApproved
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all approved companies detail successfully',
      pagination: {
        totalCount,
        currentPage: page,
        totalPages
      },
      data: companies
    });
  }

  public async readMyCompanies(req: Request, res: Response) {
    let { page = 1, limit = 5, filter = '' } = req.query;
    // const companies = await companyService.readMyCompanies(req.currentUser);

    const { companies, totalCount, totalPages } = await companyService.readMyCompanies(
      {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        filter: filter as string
      },
      req.currentUser
    );

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all companies detail successfully',
      pagination: {
        totalCount,
        currentPage: page,
        totalPages
      },
      data: companies
    });
  }

  public async readOne(req: Request, res: Response) {
    const company = await companyService.readOne(parseInt(req.params.id), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get single company detail successfully',
      data: company
    });
  }

  public async update(req: Request, res: Response) {
    const company = await companyService.update(parseInt(req.params.id), req.body, req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Update company detail successfully',
      data: company
    });
  }

  public async approved(req: Request, res: Response) {
    const company = await companyService.approved(parseInt(req.params.id), req.body.isApproved);

    return res.status(HTTP_STATUS.OK).json({
      message: `Change company's isApproved successfully`,
      data: company
    });
  }

  public async remove(req: Request, res: Response) {
    await companyService.remove(parseInt(req.params.id), req.currentUser);

    return res.status(HTTP_STATUS.OK).json({
      message: `Delete company with id ${req.params.id} successfully`
    });
  }

  public async removeByAdmin(req: Request, res: Response) {
    await companyService.removeByAdmin(parseInt(req.params.id))

    return res.status(HTTP_STATUS.OK).json({
      message: `Delete company with id ${req.params.id} successfully`
    });
  }

  public async getCompanyView(req: Request, res: Response) {
    const view = await companyService.getCompanyView(Number(req.params.companyId), req.currentUser)

    return res.status(HTTP_STATUS.OK).json({
      message: `Get company views successfully`,
      data: view
    });
  }
}

export const companyController: CompanyController = new CompanyController();

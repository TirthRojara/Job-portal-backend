import prisma from '~/prisma';
import { companyService } from '../company/company.service';
import { NotFountException } from '~/globals/cores/error.cores';
import { Industry } from '@prisma/client';

class CompanyIndustryService {
  public async getAllIndustries(): Promise<Industry[]> {
    const industries = await prisma.industry.findMany();
    return industries;
  }

  private async findIndustry(industryId: number) {
    const industry = await prisma.industry.findUnique({
      where: { id: industryId }
    });

    if (!industry) throw new NotFountException(`Industry with id: ${industryId} not found`);

    return industry;
  }

  public async add(industryId: number, companyId: number, currentUser: UserPayLoad) {
    const company = await companyService.findOne(companyId, currentUser.id);
    await this.findIndustry(industryId);

    const companyIndustry = await prisma.companyIndustry.create({
      data: {
        companyId: company.id,
        industryId
      }
    });

    return companyIndustry;
  }

  public async getCompanyIndustry(companyId: number) {
    await companyService.readOne(companyId);
    const companyIndustry = await prisma.companyIndustry.findMany({
      where: { companyId }
    });

    if (companyIndustry.length === 0) throw new NotFountException(`No data found in company with id: ${companyId}`);

    return companyIndustry;
  }

  public async remove(industryId: number, companyId: number, currentUser: UserPayLoad): Promise<void> {
    const company = await companyService.findOne(companyId, currentUser.id);
    await this.findIndustry(industryId);

    await prisma.companyIndustry.delete({
      where: { companyId_industryId: { companyId: company.id, industryId } }
    });
  }
}

export const companyIndustryService: CompanyIndustryService = new CompanyIndustryService();

import { Express } from 'express';
import { companyService } from '../company/company.service';
import prisma from '~/prisma';
import { CompanyImage } from '@prisma/client';
import { NotFountException } from '~/globals/cores/error.cores';
import { deleteImage } from '~/globals/helpers/upload.helper';

class CompanyImageService {
  public async add(companyId: number, currentUser: UserPayLoad, files: Express.Multer.File[]) {
    const company = await companyService.findOne(companyId, currentUser.id);

    const data = files.map((file) => {
      return {
        companyId: company.id,
        imageUrl: file.filename
      };
    });

    await prisma.companyImage.createMany({
      data
    });
  }

  public async readAll(companyId: number): Promise<CompanyImage[]> {
    const companyImages = await prisma.companyImage.findMany({
      where: { companyId }
    });

    if (companyImages.length === 0)
      throw new NotFountException(`Can't find company images with company id ${companyId}`);

    return companyImages;
  }

  private async findOne(companyImageId: number, companyId: number): Promise<CompanyImage> {
    const companyImage = await prisma.companyImage.findFirst({
      where: { companyId, id: companyImageId }
    });

    if (!companyImage) throw new NotFountException(`Can't find image`);

    return companyImage;
  }

  public async remove(companyId: number, companyImageId: number, currentUser: UserPayLoad) {
    const company = await companyService.findOne(companyId, currentUser.id);
    const image = await this.findOne(companyImageId, companyId)

    deleteImage(image.imageUrl);

    await prisma.companyImage.delete({
      where: { id: companyImageId, companyId: company.id }
    });
  }
}

export const companyImageService: CompanyImageService = new CompanyImageService();

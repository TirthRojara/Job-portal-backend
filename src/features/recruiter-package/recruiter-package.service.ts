import prisma from '~/prisma';
import { orderService } from '../order/order.service';
import { BadRequestException, NotFountException } from '~/globals/cores/error.cores';
import { packageService } from '../package/package.service';

class RecruiterPackageService {
  public async findActivePackage(recruiterId: number) {
    // const recruiterPackage = await prisma.recruiterPackage.findFirst({
    //   where: {
    //     recruiterId,
    //     endDate: { gt: new Date(Date.now()) }
    //   }
    // });
    const recruiterPackage = await prisma.recruiterPackage.findFirst({
      where: {
        recruiterId,
        endDate: { gt: new Date(Date.now()) }
      },
      include: {
        package: true
      }
    })

    console.log('Active package:', recruiterPackage);
    return recruiterPackage;
  }

  public async create(packageId: number, currentUser: UserPayLoad) {
    const startDate = new Date(Date.now());
    const clonedStartDate = new Date(Date.now());
    const endDate = new Date(clonedStartDate.setMonth(clonedStartDate.getMonth() + 1));

    // Throw error if recruiter already has an active package 
    const existPackage = await this.findActivePackage(currentUser.id);

    // Get active package detail
    // const PackageDetail =  await packageService.readOneForRecruiter(packageId);
  
    // Throw error if recruiter already has an active package 
    // if (existPackage && existPackage.endDate > new Date(Date.now())) {
    if (existPackage) {
      throw new BadRequestException(`You already have an active package`);
    }

    const recruiterPackage = await prisma.recruiterPackage.create({
      data: {
        packageId,
        recruiterId: currentUser.id,
        startDate,
        endDate
      }
    });

    //TODO: add to order table
    await orderService.create(packageId, currentUser);

    return recruiterPackage;
  }
}

export const recruiterPackageService: RecruiterPackageService = new RecruiterPackageService();

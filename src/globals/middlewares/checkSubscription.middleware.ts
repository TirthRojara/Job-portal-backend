import { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../cores/error.cores';
import prisma from '~/prisma';
import { RecruiterPackageStatus } from '@prisma/client';

export async function SubscriptionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.currentUser.role !== 'RECRUITER') {
      next(new BadRequestException('Only recruiter can access this resource'));
    }

    let activePackage = await prisma.recruiterPackage.findUnique({
      where: { userId: req.currentUser.id },
      // where: { userId: 4 },
      include: { package: true }
    });

    const now = new Date();

    if (!activePackage) {
      next(new BadRequestException(`Can't find active package for the user id: ${req.currentUser.id}`));
      return;
    }

    const currentDate = new Date();
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(currentDate.getMonth() + 1);
    const endDate = oneMonthLater;

    if (activePackage.endDate && activePackage.endDate < now) {
      activePackage = await prisma.recruiterPackage.update({
        where: { userId: req.currentUser.id },
        data: {
          packageId: 4,
          endDate,
          startDate: now,
          status: RecruiterPackageStatus.ACTIVE,
          razorpaySubscriptionId: null
        },
        include: { package: true }
      });
    }

    // if (!activePackage || (activePackage.endDate && activePackage.endDate < now)) {
    //   // Assign free package if none or expired
    //   activePackage = await prisma.recruiterPackage.upsert({
    //     where: { userId: req.currentUser.id },
    //     // where: { userId: 4 },
    //     update: {
    //       packageId: 4,
    //       endDate: null,
    //       startDate: now,
    //       status: RecruiterPackageStatus.ACTIVE
    //     },
    //     create: {
    //       userId: req.currentUser.id,
    //       // userId: 4,
    //       packageId: 4,
    //       startDate: now,
    //       // endDate: new Date('2099-12-31'),
    //       endDate: null,
    //       status: RecruiterPackageStatus.ACTIVE
    //     },
    //     include: { package: true }
    //   });
    // }

    req.recruiterPackage = activePackage;
    next();
  } catch (error) {
    console.error('Subscription Middleware Error: ', error);
    next(new BadRequestException('Subscription verification failed'));
  }
}

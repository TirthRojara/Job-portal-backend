import { NextFunction, Request, Response } from 'express';
import prisma from '~/prisma';
import { ForbiddenException } from '../cores/error.cores';


export  function checkPermission(model: any, foreignField: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.currentUser.id;
    const userRole = req.currentUser.role;
    const entityId = parseInt(req.params.id);

    try {
      const entity = await (prisma[model] as any).findUnique({
        where: { id: entityId }
      });

      if (userRole === 'ADMIN' || userRole === 'RECRUITER' || userId === entity[foreignField]) {
        return next();
      }

      return next(new ForbiddenException(`You don't have permission to access`));
    } catch (error) {
      next(error);
    }
  };
}

export async function checkPermission_A_R(req: Request, res: Response, next: NextFunction) {
  const userRole = req.currentUser.role;

  try {
    if (userRole === 'ADMIN' || userRole === 'RECRUITER') {
      return next();
    }

    return next(new ForbiddenException(`You don't have permission to access`));
  } catch (error) {
    next(error);
  }
}

export async function checkPermission_A(req: Request, res: Response, next: NextFunction) {
  const userRole = req.currentUser.role;

  try {
    if (userRole === 'ADMIN') {
      return next();
    }

    return next(new ForbiddenException(`You don't have permission to access`));
  } catch (error) {
    next(error);
  }
}

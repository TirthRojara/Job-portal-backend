import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../cores/error.cores';

export function allowAccess(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(new ForbiddenException(`You don' have permission to access`));
    }

    return next();
  };
}

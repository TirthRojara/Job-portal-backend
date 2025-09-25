import { Request, Response, NextFunction } from 'express';
import prisma from '~/prisma';
import { userService } from '../services/user.service';
import { BadRequestException } from '~/globals/cores/error.cores';
import { userCreateSchema } from '../schemas/user.schema';
import HTTP_STATUS from '~/globals/constants/http.constant';

class UserController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    // next( new BadRequestException('asdffsdfaf'))

    const users = await userService.getAll();

    res.status(200).json({
      message: 'Get all users successfully',
      data: users
    });
  }

  public async create(req: Request, res: Response, next: NextFunction) {

    const { error } = userCreateSchema.validate(req.body)
    console.log("check error", error)

    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Validation error',
        error
      })
    }

    const user = await userService.createUser(req.body);

    return res.status(201).json({
      message: 'Create user successfully',
      data: user
    });
  }
}

export const userController: UserController = new UserController();

import { Request, Response, NextFunction } from 'express';
import prisma from '~/prisma';
import { userService } from './user.service';
import { BadRequestException } from '~/globals/cores/error.cores';
import HTTP_STATUS from '~/globals/constants/http.constant';

class UserController {
    public async getUserData(req: Request, res: Response) {
        const user = await userService.getUserData(req.currentUser);

        return res.status(HTTP_STATUS.OK).json({
            message: 'get user data successfully',
            data: user
        });
    }
}

export const userController: UserController = new UserController();

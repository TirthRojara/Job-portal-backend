import { NextFunction, Request, Response } from 'express';
import { BadRequestException, UnauthorizedException } from '../cores/error.cores';
import jwt from 'jsonwebtoken';
import { log } from '../helpers/log.helper';
import { authService } from '~/features/auth/auth.service';
import { IJwtPayload, IJwtVerifyPayload } from '~/features/auth/auth.interface';
import { userService } from '~/features/user/user.service';

export async function verifyUser(req: Request, res: Response, next: NextFunction) {

  // // 1) Get token from cookie
  // if (!req.cookies?.accessToken) {
  //   // throw new BadRequestException('Please login again')  // this error can be use with asyncwrapper
  //   next(new BadRequestException('Please login again'));
  // }
  // const token = req.cookies.accessToken;
  // //   const token = req.header('Authorization').replace('Bearer ', '');
  // //   const token = req.headers.authorization?.split(' ')[1];

  // // 2) Verify token
  // try {
  //   const decoded = (await jwt.verify(token, process.env.JWT_SECRET!)) as UserPayLoad;
  //   const { name, email, role, id } = decoded;

  //   // 3) assign verify token from step 2, assign to req.currentUser
  //   req.currentUser = { name, email, role, id };

  //   next();
  // } catch (error: any) {
  //   // throw new BadRequestException('Please login again')
  //   next(new BadRequestException('Please login again'));
  // }

  try {
    
    const token = req.headers.authorization?.split(' ')[1];

    log.info('ckecking in middleware');

    // console.log(token)

    if (!token) throw new UnauthorizedException('Token in required');

    const decoded = (await authService.verifyJwtToken(token.trim(), process.env.ACCESS_TOKEN_SECRET!)) as IJwtVerifyPayload;

    await userService.checkUserVerified(Number(decoded.sub));

    const auth: UserPayLoad = {
      id: Number(decoded.sub),
      email: decoded.email,
      role: decoded.role
    };

    req.currentUser = auth;
    next();
  } catch (error) {
    next(new UnauthorizedException(`Please login again. \n ${error}`));
  }
}

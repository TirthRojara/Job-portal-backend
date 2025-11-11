import { User } from '@prisma/client';
import {
  BadRequestException,
  CustomErrorException,
  NotFountException,
  UnauthorizedException
} from '~/globals/cores/error.cores';
import prisma from '~/prisma';
import bcrypt from 'bcrypt';
import { userCreateSchema } from './user.schema';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { IRefreshToken, ISignUpPayload } from '../auth/auth.interface';
import { log } from '~/globals/helpers/log.helper';
import { IUserUpdate } from './user.interface';

class UserService {
  // public async createUser(requestBody: any): Promise<User>{
  //     const { name, email, password, role } = requestBody
  //     // const isEmailExist = true;
  //     // if (isEmailExist) {
  //     //     throw new BadRequestException('Email already exist')
  //     // }
  //     const user = await prisma.user.create({
  //         data: {
  //             name,
  //             email,
  //             password,
  //             status: true,
  //             role: 'CANDIDATE'
  //         }
  //     })
  //     return user
  // }
  // public async getAll(): Promise<User[]> {
  //     const users = await prisma.user.findMany()
  //     return users;
  // }

  public async createUser(userData: ISignUpPayload) {
    const existedUser = await prisma.user.findUnique({
      where: { email: userData.email, isVerified: true }
    });

    log.info('Existed User:', existedUser);

    if (existedUser) {
      throw new CustomErrorException('Email already in use', 409);
    }

    // Hash password
    userData.password = await bcrypt.hash(userData.password, 10);

    const newUser = await prisma.user.create({
      data: userData
    });

    return newUser;
  }

  public async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new NotFountException('User not found');
    }

    return user;
  }

  public async checkPassword(password: string, user: User, shouldMatch: boolean = true) {
    const isMatch = await bcrypt.compare(password, user.password);
    log.info('check password isMatch: ', isMatch);

    if (shouldMatch && !isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!shouldMatch && isMatch) {
      throw new BadRequestException('New password must be different from the old one');
    }
  }

  public async checkUserVerified(userId: number) {
    const isVerified = await prisma.user.findUnique({
      where: { id: userId, isVerified: true }
    });

    if (!isVerified) {
      throw new UnauthorizedException('User is not verified');
    }
  }

  public async storeRefreshToken(data: IRefreshToken) {
    const refreshToken = await prisma.refreshToken.create({ data });

    return refreshToken;
  }
}

export const userService: UserService = new UserService();

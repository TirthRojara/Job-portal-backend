import { AuthType, User } from '@prisma/client';
import {
    BadRequestException,
    CustomErrorException,
    ForbiddenException,
    InternalServerError,
    NotFountException,
    UnauthorizedException
} from '~/globals/cores/error.cores';
import prisma from '~/prisma';
import bcrypt from 'bcrypt';
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
        const { name, email, password, role, authType } = userData;

        const existedUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existedUser) {
            if (existedUser.isVerified) {
                throw new CustomErrorException('Email already in use', 409);
            }
        }

        let hashPassword;
        let newUser;

        if (authType === AuthType.EMAIL) {
            // Hash password
            hashPassword = await bcrypt.hash(password, 10);

            newUser = await prisma.user.upsert({
                where: { email },
                create: { name, email, password: hashPassword, role },
                update: { name, password: hashPassword }
            });
        } else {
            newUser = await prisma.user.upsert({
                where: { email },
                create: { name, email, password: null, role },
                update: { name }
            });
        }

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
        const authOTP = await prisma.authOTP.findUnique({
            where: { userId: user.id }
        });

        if (!authOTP) throw new InternalServerError('Auth OTP record not found');

        const now = Date.now();
        if (authOTP.lockUntil && now > authOTP.lockUntil.getTime()) {
            const updateAfterMatch = await prisma.authOTP.update({
                where: { userId: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockUntil: null
                }
            });
        }

        if (authOTP.lockUntil && now < authOTP.lockUntil.getTime()) {
            throw new ForbiddenException(`Can't login till ${authOTP.lockUntil}`);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // log.info('check password isMatch: ', isMatch);

        if (shouldMatch && !isMatch) {
            const updateAuth = await prisma.authOTP.update({
                where: { userId: user.id },
                data: {
                    failedLoginAttempts: { increment: 1 }
                }
            });

            if (updateAuth.failedLoginAttempts >= 3) {
                await prisma.authOTP.update({
                    where: { userId: user.id },
                    data: {
                        lockUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
                    }
                });
            }

            throw new BadRequestException('Invalid credentials');
        }

        if (!shouldMatch && isMatch) {
            throw new BadRequestException('New password must be different from the old one');
        }

        const updateAfterMatch = await prisma.authOTP.update({
            where: { userId: user.id },
            data: {
                failedLoginAttempts: 0,
                lockUntil: null
            }
        });
        // console.log(updateAfterMatch);
    }

    public async checkUserVerified(userId: number) {
        const isVerified = await prisma.user.findUnique({
            where: { id: userId, isVerified: true }
        });

        if (!isVerified) {
            throw new UnauthorizedException('User is not verified');
        }
    }
}

export const userService: UserService = new UserService();

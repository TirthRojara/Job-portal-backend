import { AuthType, RecruiterPackageStatus, User } from '@prisma/client';
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
import { IOAuthSignupLoginPayload, IRefreshToken, ISignUpPayload } from '../auth/auth.interface';
import { log } from '~/globals/helpers/log.helper';
import { IUserUpdate } from './user.interface';
import { profile } from 'console';

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
        const { name, email, password, role } = userData;

        const existedUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existedUser) {
            if (existedUser.isVerified) {
                throw new CustomErrorException('Email already in use', 409);
            }
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.upsert({
            where: { email },
            create: { name, email, password: hashPassword, role, authType: AuthType.EMAIL },
            // update: {} // here there was bug
            update: { name, email, password: hashPassword, role, authType: AuthType.EMAIL }
        });

        if (role === 'RECRUITER') {
            await prisma.recruiterPackage.create({
                data: {
                    status: RecruiterPackageStatus.ACTIVE,
                    userId: newUser.id,
                    packageId: 4 // free package
                }
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
        ///////////////////
        // if (user.password == null) throw new BadRequestException('password is null')

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

        const isMatch = await bcrypt.compare(password, user.password!); //////////////////////////////
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

    public async getUserData(currentUser: UserPayLoad) {
        // ‼️‼️ add redis cache here ‼️‼️

        const user = await prisma.user.findUnique({
            where: { id: currentUser.id },
            select: { id: true, email: true, name: true, role: true, authType: true }
        });

        if (user?.role === 'RECRUITER') {
            const company = await prisma.company.findMany({
                where: { userId: user.id },
                select: { id: true, name: true }
            });

            const recruiter = { ...user, companyId: company[0].id };

            return recruiter;
        }

        return user;
    }
}

class UserOAuthService {
    public async OAuthSignupLogin(payload: IOAuthSignupLoginPayload) {
        const { name, email, ProviderAuthId, authType, role } = payload;

        let user = await prisma.user.findUnique({
            where: { email }
        });

        // new user ✅
        // user email exist but not verify ✅
        // user exist, verify with email ✅
        // try to login with Oauth and verify ✅

        if (user) {
            // try to login with Oauth and verify ✅
            if (user.authType === AuthType.OAUTH && user.isVerified) {
                return user;
            }

            // user exist, verify with email ✅
            if (user.authType === AuthType.EMAIL && user.isVerified) {
                throw new CustomErrorException('Email already in use', 409);
            }

            // user email exist but not verify ✅
            const newUser = await prisma.user.update({
                where: { email },
                data: {
                    name,
                    email,
                    password: null,
                    role,
                    isVerified: true,
                    authType: AuthType.OAUTH,
                    ProviderAuthId
                }
            });

            await prisma.authOTP.upsert({
                where: { userId: newUser.id },
                create: { userId: newUser.id },
                update: {}
            });

            return newUser;
        } else {
            // new user ✅
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: null,
                    role,
                    isVerified: true,
                    authType: AuthType.OAUTH,
                    ProviderAuthId
                }
            });

            await prisma.authOTP.upsert({
                where: { userId: newUser.id },
                create: { userId: newUser.id },
                update: {}
            });

            // check is this working or not !!!!!!!!!!!!!!!!!!!!
            if (role === 'RECRUITER') {
                await prisma.recruiterPackage.create({
                    data: {
                        status: RecruiterPackageStatus.ACTIVE,
                        userId: newUser.id,
                        packageId: 4 // free package
                    }
                });
            }

            return newUser;
        }
    }

    public async setPasswordForOauth(password: string, confirmPassword: string, userId: number) {
        if (password !== confirmPassword) {
            throw new BadRequestException('Confirm password must match password');
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (user!.password) throw new BadRequestException(`Can't set the pasword, try to change the pasword`);

        if (user!.authType === AuthType.EMAIL) throw new BadRequestException('this is only for OAuth user');

        if (user!.password !== null) {
            throw new BadRequestException('User already has password');
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashPassword }
        });
    }

    public async isPasswordSet(currentUser: UserPayLoad): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { id: currentUser.id }
        });

        // If password is NOT null, this returns true. If it is null, returns false.
        const isPasswordSet = user!.password !== null;

        return isPasswordSet;
    }
}

export const userService: UserService = new UserService();
export const userOAuthService: UserOAuthService = new UserOAuthService();

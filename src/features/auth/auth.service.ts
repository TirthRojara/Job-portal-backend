import prisma from '~/prisma';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import {
    BadRequestException,
    CustomErrorException,
    ForbiddenException,
    InternalServerError,
    NotFountException,
    UnauthorizedException
} from '~/globals/cores/error.cores';
import { OTPFor, RecruiterPackageStatus, User } from '@prisma/client';
import { generateOTP, OTP_DETAILS } from './auth.utils';
import { log } from '~/globals/helpers/log.helper';

class AuthService {
    // public async signUp(requestBody: any) {
    //   const { email, name, password, role } = requestBody;

    //   const existingUser = await prisma.user.findUnique({ where: { email } });
    //   if (existingUser) {
    //     throw new BadRequestException('Email already in use');
    //   }

    //   // Hash password
    //   const hashedPassword = await bcrypt.hash(password, 10);

    //   const user = await prisma.user.create({
    //     data: {
    //       email,
    //       name,
    //       password: hashedPassword,
    //       role: role ? role : 'CANDIDATE'
    //     }
    //   });

    //   if ( role === 'RECRUITER' ) {
    //     await prisma.recruiterPackage.create({
    //       data: {
    //         status: RecruiterPackageStatus.ACTIVE,
    //         userId: user.id,
    //         packageId: 4 // free package
    //       }
    //     })
    //   }

    //   //create JWT
    //   const accessToken = generateToken(user);

    //   return accessToken;
    // }

    // public async signIn(requestBody: any) {
    //   const { email, password } = requestBody;

    //   // 1) Make sure email exist
    //   const userByEmail = await this.findUserByEmail(email);

    //   if (!userByEmail) throw new NotFountException(`The email ${email} does not exist`);

    //   // 2) Make sure match password
    //   const isMatchPassword = await bcrypt.compare(password, userByEmail.password);
    //   if (!isMatchPassword) throw new BadRequestException('Invalid credentials');

    //   // 3) Generate token
    //   const accessToken = generateToken(userByEmail);
    //   return accessToken;
    // }

    // private async findUserByEmail(email: string): Promise<User | null> {
    //   return await prisma.user.findFirst({
    //     where: { email }
    //   });
    // }

    public async generateOtp(userId: number, context: OTPFor) {
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + OTP_DETAILS.EXPIRATION_TIME);
        const lastOtpSentAt = new Date();

        let auth = await prisma.authOTP.findUnique({
            where: { userId, otpFor: context }
        });

        // log.info('auth', auth);
        console.log(auth);

        if (!auth) {
            
            console.log('inside the if (!auth)')

            const newAuth = await prisma.authOTP.create({
                data: {
                    userId,
                    otpCode: otp,
                    resendCount: 2,
                    lastOtpSentAt,
                    expiresAt,
                    otpFor: context
                }
            });

            return otp;
        } else {

            console.log('inside else')

            if (auth.lastOtpSentAt && Date.now() - auth.lastOtpSentAt.getTime() < OTP_DETAILS.MIN_INTERVAL) {
                throw new CustomErrorException('You must wait before requesting a new OTP', 429);
            }

            const now = Date.now();
            if (auth.expiresAt === null || (auth.lastOtpSentAt && now - auth.lastOtpSentAt.getTime() > OTP_DETAILS.PASSED_TIME)) {

                console.log(' resend count = 3')

                auth = await prisma.authOTP.update({
                    where: { userId },
                    data: { resendCount: OTP_DETAILS.MAX_RESEND_COUNT }
                });
            }

            if (auth.resendCount <= 0) {

                console.log(` inside \n if (auth.resendCount <= 0)`)

                throw new ForbiddenException('You have reached the maximum resend limit');
            }

            const updateAuth = await prisma.authOTP.update({
                where: { userId },
                data: {
                    otpCode: otp,
                    expiresAt,
                    resendCount: { decrement: 1 },
                    lastOtpSentAt
                }
            });

            // log.info(updateAuth)
            console.log(updateAuth);

            return otp;
        }
    }

    public async verifyOtp(user: User, otp: number, context: OTPFor) {
        const auth = await prisma.authOTP.findUnique({
            where: { userId: user.id, otpFor: context }
        });

        if (!auth) throw new BadRequestException('Please verify your email first');

        const now = Date.now();

        if (!auth.expiresAt || now > auth.expiresAt.getTime()) {
            throw new UnauthorizedException('Session has expired');
        }

        if (auth.otpCode !== otp) {
            throw new UnauthorizedException('Invalid OTP code');
        }

        await prisma.authOTP.update({
            where: { userId: user.id },
            data: {
                otpCode: null,
                expiresAt: null,
                resendCount: OTP_DETAILS.MAX_RESEND_COUNT,
                lastOtpSentAt: null
            }
        });

        if (context === OTPFor.VERIFICATION) {
            await prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true }
            });
        }

        return;
    }

    public generateJwtToken(payload: object, key: string, options?: jwt.SignOptions) {
        try {
            const token = jwt.sign(payload, key, options);
            return token;
        } catch (error) {
            log.error('JWT generation Error: ', error);
            throw new InternalServerError('Failed to generate token');
        }
    }

    public async verifyJwtToken(token: string, key: string) {
        try {
            const decoded = jwt.verify(token, key);
            return decoded;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}

export const authService: AuthService = new AuthService();

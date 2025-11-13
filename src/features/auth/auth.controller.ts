import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { authService } from './auth.service';
import HTTP_STATUS from '~/globals/constants/http.constant';
// import { sendTokenToCookie } from '~/globals/helpers/cookie.helper';
import {
    IChangePasswordPayload,
    IForgotPasswordPayload,
    IJwtPayload,
    IJwtRefreshTokenPayload,
    IJwtVerifyPayload,
    IJwtVerifyRefreshTokenPayload,
    ILoginPayload,
    IRefreshToken,
    IResendOtp,
    IresetForgotPasswordPayload,
    ISignUpPayload,
    IVerifyForgotPasswordPayload,
    IVerifyPayload,
    ResentOtpType
} from './auth.interface';
import { userService } from '../user/user.service';
import { OTPFor } from '@prisma/client';
import { sendEmail } from '~/globals/helpers/sendMail.helper';
import {
    BadRequestException,
    ForbiddenException,
    NotFountException,
    UnauthorizedException
} from '~/globals/cores/error.cores';
import { COOKIE_MAX_AGE, TOKEN_EXPIRY } from './auth.utils';
import { date } from 'joi';
import tokens from 'razorpay/dist/types/tokens';
import prisma from '~/prisma';
import { Http2ServerRequest } from 'http2';

class AuthController {
    public async signUp(req: Request, res: Response) {
        const payload = req.body as ISignUpPayload;

        const user = await userService.createUser(payload);
        const otp = await authService.generateOtp(user.id, OTPFor.VERIFICATION);

        // await sendEmail(user.email, { name: user.name, otp }, OTPFor.VERIFICATION);

        return res.status(HTTP_STATUS.OK).json({
            message: `OTP sent successfully to ${user.email}`
        });
    }

    public async resendOtp(req: Request, res: Response) {
        const { email, type } = req.body as IResendOtp;

        const user = await userService.findUserByEmail(email);
        console.log(user.id);

        const context = type === ResentOtpType.signup ? OTPFor.VERIFICATION : OTPFor.FORGOT_PASSWORD;
        const otp = await authService.generateOtp(user.id, context);

        // await sendEmail(user.email, { name: user.name, otp}, context)

        return res.status(HTTP_STATUS.OK).json({
            message: `OTP resent successfully to ${user.email}`
        });
    }

    public async verify(req: Request, res: Response) {
        const { otp, email, isRememberMe } = req.body as IVerifyPayload;

        const user = await userService.findUserByEmail(email);

        await authService.verifyOtp(user, otp, OTPFor.VERIFICATION);

        const accessPayload: IJwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        const refreshPayload: IJwtRefreshTokenPayload = {
            sub: user.id,
            email: user.email
        };

        const accessToken = authService.generateJwtToken(accessPayload, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: TOKEN_EXPIRY.ACCESS
        });

        const refreshTokenExpiry = isRememberMe ? TOKEN_EXPIRY.REFRESH.REMEMBER_ME : TOKEN_EXPIRY.REFRESH.NORMAL;
        const refreshToken = authService.generateJwtToken(refreshPayload, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: refreshTokenExpiry
        });

        res.cookie('__secure-rtk', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: isRememberMe ? COOKIE_MAX_AGE.REFRESH.REMEMBER_ME : COOKIE_MAX_AGE.REFRESH.NORMAL
        });

        const expiresAt = authService.getExpiryDate(refreshTokenExpiry);
        await authService.storeRefreshToken({ userId: user.id, token: refreshToken, expiresAt });

        return res.status(HTTP_STATUS.OK).json({
            message: 'User verified successfully',
            data: {
                token: accessToken
            }
        });
    }

    public async login(req: Request, res: Response) {
        const { email, password, isRememberMe } = req.body as ILoginPayload;

        const user = await userService.findUserByEmail(email);

        if (!user.isVerified) {
            throw new ForbiddenException('Email not verified');
        }

        await userService.checkPassword(password, user);

        const accessPayload: IJwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        const refreshPayload: IJwtRefreshTokenPayload = {
            sub: user.id,
            email: user.email
        };

        const accessToken = authService.generateJwtToken(accessPayload, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: TOKEN_EXPIRY.ACCESS
        });

        const refreshTokenExpiry = isRememberMe ? TOKEN_EXPIRY.REFRESH.REMEMBER_ME : TOKEN_EXPIRY.REFRESH.NORMAL;
        const refreshToken = authService.generateJwtToken(refreshPayload, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: refreshTokenExpiry
        });

        res.cookie('__secure-rtk', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: isRememberMe ? COOKIE_MAX_AGE.REFRESH.REMEMBER_ME : COOKIE_MAX_AGE.REFRESH.NORMAL
        });

        const expiresAt = authService.getExpiryDate(refreshTokenExpiry);
        await authService.storeRefreshToken({ userId: user.id, token: refreshToken, expiresAt });

        return res.status(HTTP_STATUS.OK).json({
            message: 'User login successfully',
            data: {
                token: accessToken
            }
        });
    }

    public async changePassword(req: Request, res: Response) {
        if (!req.currentUser) throw new UnauthorizedException('Unauthorized: Missing authentication context');

        const { currentPassword, newPassword } = req.body as IChangePasswordPayload;

        console.log('req.currentuser: ', req.currentUser);

        const user = await userService.findUserByEmail(req.currentUser.email);

        await userService.checkPassword(currentPassword, user);
        await userService.checkPassword(newPassword, user, false);

        // Hash password
        const hashPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashPassword }
        });

        return res.status(HTTP_STATUS.OK).json({
            message: 'Password changed successfully'
        });
    }

    public async getAccessToken(req: Request, res: Response) {
        const refreshToken = req.cookies['__secure-rtk'];

        console.log('refreshToken', refreshToken);

        if (!refreshToken) throw new UnauthorizedException('Refresh token is requied');

        const decoded = (await authService.verifyJwtToken(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET!
        )) as IJwtVerifyRefreshTokenPayload;

        if (!decoded) throw new UnauthorizedException('Invalid refresh token');

        const user = await userService.findUserByEmail(decoded.email);

        if (!user.isVerified) throw new ForbiddenException('Invalid refresh token');

        const isTokenExist = await prisma.refreshToken.findUnique({
            where: {
                userId: user.id,
                token: refreshToken
            }
        });

        if (!isTokenExist) throw new ForbiddenException('Invalid refresh token');

        const accessPayload: IJwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        const accessToken = authService.generateJwtToken(accessPayload, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: TOKEN_EXPIRY.ACCESS
        });

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get access token successfully',
            data: {
                token: accessToken
            }
        });
    }

    public async forgotPassword(req: Request, res: Response) {
        const { email } = req.body as IForgotPasswordPayload;

        const user = await userService.findUserByEmail(email);

        if (!user.isVerified) throw new ForbiddenException('Email not verified');

        const otp = await authService.generateOtp(user.id, OTPFor.FORGOT_PASSWORD);

        // send the email here

        return res.status(HTTP_STATUS.OK).json({
            message: 'OTP sent for forgot password successfully'
        });
    }

    public async verifyForgotPassword(req: Request, res: Response) {
        const { email, otp } = req.body as IVerifyForgotPasswordPayload;

        const user = await userService.findUserByEmail(email);

        if (!user.isVerified) throw new ForbiddenException('Email not verified');

        await authService.verifyOtp(user, otp, OTPFor.FORGOT_PASSWORD);

        const payload: IJwtRefreshTokenPayload = {
            sub: user.id,
            email: user.email
        };

        const resetToken = authService.generateJwtToken(payload, process.env.RESET_TOKEN_SECRET!, {
            expiresIn: TOKEN_EXPIRY.RESET_PASSWORD
        });

        await prisma.authOTP.update({
            where: { userId: user.id },
            data: { resetToken }
        });

        return res.status(HTTP_STATUS.OK).json({
            message: 'OTP verified successfully',
            data: {
                resetToken
            }
        });
    }

    public async resetForgotPassword(req: Request, res: Response) {
        const { newPassword } = req.body as IresetForgotPasswordPayload;

        const resetToken = req.headers.authorization?.split(' ')[1];

        if (!resetToken) throw new UnauthorizedException('Reset token required')

        console.log('reset key: ', process.env.RESET_TOKEN_SECRET);

        const decoded = (await authService.verifyJwtToken(
            resetToken.trim(),
            process.env.RESET_TOKEN_SECRET!
        )) as IJwtVerifyRefreshTokenPayload;

        const user = await userService.findUserByEmail(decoded.email);
        const auth = await prisma.authOTP.findUnique({
            where: {
                userId: user.id,
                resetToken
            }
        });

        if (!auth) throw new UnauthorizedException('Invalid or expired reset token');

        await userService.checkPassword(newPassword, user, false);

        // Hash password
        const hashPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashPassword }
        });

        await prisma.authOTP.update({
            where: { userId: user.id },
            data: { resetToken: null }
        });

        return res.status(HTTP_STATUS.OK).json({
            message: 'Password reset successfully'
        });
    }

    // public async signUp(req: Request, res: Response, next: NextFunction) {
    //     const accessToken = await authService.signUp(req.body)

    //     //  sendTokenToCookie(res, accessToken)

    //     return res.status(HTTP_STATUS.CREATED).json({
    //         message: 'Signup user successfully',
    //     })
    // }

    // public async signIn(req: Request, res: Response) {
    //     const accessToken = await authService.signIn(req.body)

    //     sendTokenToCookie(res, accessToken)

    //     return res.status(HTTP_STATUS.OK).json({
    //         message: 'SignIn user successfully',
    //     })
    // }

    // public async getCurrentUser(req: Request, res: Response) {

    //     return res.status(HTTP_STATUS.OK).json({
    //         message: 'Get current user successfully',
    //         data: req.currentUser
    //     })
    // }

    // public async logout(req: Request, res: Response) {
    //     res.clearCookie('accessToken')

    //     return res.status(HTTP_STATUS.OK).json({
    //         message: 'Logout successfully'
    //     })
    // }p
}

export const authController: AuthController = new AuthController();

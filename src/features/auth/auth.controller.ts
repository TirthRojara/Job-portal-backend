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
    IOAuthSignupLoginPayload,
    IRefreshToken,
    IResendOtp,
    IresetForgotPasswordPayload,
    IroleCookiePayload,
    ISetPasswordPayload,
    ISignUpPayload,
    IVerifyForgotPasswordPayload,
    IVerifyPayload,
    ResentOtpType
} from './auth.interface';
import { userOAuthService, userService } from '../user/user.service';
import { AuthType, OTPFor } from '@prisma/client';
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
// import { generateCodeVerifier, generateState } from 'arctic';
// const { generateCodeVerifier, generateState } = await import('arctic');
import { google } from './auth.OAuth';

// async function loadArctic() {
//   const { generateCodeVerifier, generateState } = await import('arctic');
//   // use generateCodeVerifier, generateState here
// }
// loadArctic();

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

        if (user.authType === AuthType.OAUTH && user.password === null) {
            throw new BadRequestException('Try to login with google');
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

        if (user.authType === AuthType.OAUTH && user.password === null) {
            throw new BadRequestException('Before changing password first set the password');
        }

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

        if (user.authType === AuthType.OAUTH && user.password === null) {
            throw new BadRequestException('Try to login with google first');
        }

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

        if (!resetToken) throw new UnauthorizedException('Reset token required');

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

    public async logout(req: Request, res: Response) {
        const userId = req.currentUser.id;
        const refreshToken = req.cookies['__secure-rtk'];

        res.clearCookie('__secure-rtk');

        await prisma.refreshToken.delete({
            where: { token: refreshToken, userId }
        });

        return res.status(HTTP_STATUS.OK).json({
            message: 'Logout successfully'
        });
    }

    public async setRoleCookie(req: Request, res: Response) {
        const { role } = req.body as IroleCookiePayload;

        res.cookie('role', role, {
            httpOnly: true,
            // secure: true,
            secure: false, // only in dev
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        console.log('role Cookie set');

        return res.status(HTTP_STATUS.OK).json({
            message: 'Role cookie is set',
            data: {
                role
            }
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
    // }
}

class GoogleAuthController {
    public async getGoogleLoginPage(req: Request, res: Response) {
        const { generateCodeVerifier, generateState } = await import('arctic');

        if (req.currentUser) return res.redirect('/');

        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const scopes = ['openid', 'profile', 'email'];
        const url = google.createAuthorizationURL(state, codeVerifier, scopes);

        // store state as cookie
        res.cookie('state', state, {
            secure: false, // set to false in localhost
            path: '/',
            httpOnly: true,
            maxAge: 10 * 60 * 1000, // 10 min
            sameSite: 'lax' // for dev mode
        });

        // store code verifier as cookie
        res.cookie('code_verifier', codeVerifier, {
            secure: false, // set to false in localhost
            path: '/',
            httpOnly: true,
            maxAge: 10 * 60 * 1000, // 10 min
            sameSite: 'lax' // for dev mode
        });

        res.redirect(url.toString());
    }

    public async googleCallback(req: Request, res: Response) {
        const { decodeIdToken } = await import('arctic');

        const { code, state } = req.query;

        const storedState = req.cookies['state'];
        const storedCodeVerifier = req.cookies['code_verifier'];

        if (code === null || storedState === null || state !== storedState || storedCodeVerifier === null) {
            throw new BadRequestException(`Please try again!`);
        }

        try {
            const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

            const role = req.cookies['role'];

            const claims = decodeIdToken(tokens.idToken());
            const { sub: googleUserId, name, email } = claims as any;

            // ******************************************

            const payload: IOAuthSignupLoginPayload = {
                name,
                email,
                authType: AuthType.OAUTH,
                ProviderAuthId: googleUserId,
                role
            };

            ///////////////////////
            const user = await userOAuthService.OAuthSignupLogin(payload);

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

            const refreshTokenExpiry = TOKEN_EXPIRY.REFRESH.NORMAL;
            const refreshToken = authService.generateJwtToken(refreshPayload, process.env.REFRESH_TOKEN_SECRET!, {
                expiresIn: refreshTokenExpiry
            });

            res.cookie('__secure-rtk', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: COOKIE_MAX_AGE.REFRESH.NORMAL
            });

            const expiresAt = authService.getExpiryDate(refreshTokenExpiry);
            await authService.storeRefreshToken({ userId: user.id, token: refreshToken, expiresAt });

            // res.redirect('http://localhost:5173/success');

            return res.status(HTTP_STATUS.OK).json({
                message: 'User verified successfully',
                data: {
                    token: accessToken
                }
            });
        } catch (e) {
            throw new BadRequestException(
                `Couldn't login with Google because of invalid login attempt. Please try again! \n ${e}`
            );
        }
    }

    public async setPasswordForOauth(req: Request, res: Response) {
        const { password, confirmPassword } = req.body as ISetPasswordPayload;

        await userOAuthService.setPasswordForOauth(password, confirmPassword, req.currentUser.id);

        return res.status(HTTP_STATUS.OK).json({
            message: 'password set successfully'
        });
    }
}

export const googleAuthController: GoogleAuthController = new GoogleAuthController();
export const authController: AuthController = new AuthController();

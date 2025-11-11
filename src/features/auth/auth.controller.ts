import { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { sendTokenToCookie } from '~/globals/helpers/cookie.helper';
import { IResendOtp, ISignUpPayload, ResentOtpType } from './auth.interface';
import { userService } from '../user/user.service';
import { OTPFor } from '@prisma/client';
import { sendEmail } from '~/globals/helpers/sendMail.helper';
import { BadRequestException } from '~/globals/cores/error.cores';

class AuthController {
    public async signUp(req: Request, res: Response) {
        const payload = req.body as ISignUpPayload;

        const user = await userService.createUser(payload);
        const otp = await authService.generateOtp(user.id, OTPFor.VERIFICATION);

        // await sendEmail(user.email, { name: user.name, otp }, OTPFor.VERIFICATION);

        return res.status(HTTP_STATUS.OK).json({
            message: `OTP sent successfully to ${user.email}`
        })
    }

    public async resendOtp(req: Request, res: Response) {
        const { email, type } = req.body as IResendOtp

        const user = await userService.findUserByEmail(email)
        console.log(user.id)

        const context = type === ResentOtpType.signup ? OTPFor.VERIFICATION : OTPFor.FORGOT_PASSWORD        
        const otp = await authService.generateOtp(user.id, context)

        // await sendEmail(user.email, { name: user.name, otp}, context)

        return res.status(HTTP_STATUS.OK).json({
            message: `OTP resent successfully to ${user.email}`
        })
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

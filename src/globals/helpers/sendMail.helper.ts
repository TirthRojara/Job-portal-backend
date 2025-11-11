import { Resend } from 'resend';
import { log } from './log.helper';
import { CustomErrorException, InternalServerError } from '../cores/error.cores';
import { OTPFor } from '@prisma/client';
import 'dotenv/config';

// console.log(process.env.RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY);

// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'tirth744clg@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });

type RequireUserData = {
    otp: number;
    name: string;
};

export const prepareHtml = (userData: RequireUserData, emailType: OTPFor): string => {
    const { name, otp } = userData;

    const purpose = emailType === 'FORGOT_PASSWORD' ? 'reset your password' : 'verify your email address';

    return `
        <p>Hi ${name},</p>
        <p>
            To ${purpose}, please use the One-Time Password (OTP) below.
            This code is valid for the next <strong>15 minutes</strong>:
        </p>
        <p><strong>Your OTP Code: ${otp}</strong></p>
    `;
};

export const sendEmail = async (to: string, details: RequireUserData, emailType: OTPFor): Promise<void> => {
    try {
        const html = prepareHtml(details, emailType);
        const subject = 'Your Verification Code';

        console.log(html)

        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'tirth744clg@gmail.com',
            subject,
            html
        });

        console.log('in sendEmail');

        log.info('Email response', response);

        if (!response || !response.data || response.error) {
            throw new InternalServerError('Failed to send email. Please try again later.');
        }
    } catch (error: any) {
        throw new CustomErrorException(
            error?.message || 'Something went wrong while sending email.',
            error?.statusCode || 500
        );
    }
};

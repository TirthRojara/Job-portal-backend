import { AuthType, Role } from '@prisma/client';

export enum ROLEwithoutADMIN {
    CANDIDATE = 'CANDIDATE',
    RECRUITER = 'RECRUITER'
}

export interface IRefreshToken {
    token: string;
    expiresAt: Date;
    userId: number;
}

export type IJwtPayload = {
    sub: number;
    email: string;
    role: Role;
};

export type IJwtVerifyPayload = {
    sub: string;
    email: string;
    role: Role;
};

export type IJwtRefreshTokenPayload = {
    sub: number;
    email: string;
}


export type IJwtVerifyRefreshTokenPayload = {
    sub: string;
    email: string;
}

// Controller schema

export interface ISignUpPayload {
    name: string;
    email: string;
    password: string;
    role: ROLEwithoutADMIN;
    authType?: AuthType;
}

export enum ResentOtpType {
    signup = 'signup',
    forgotpassword = 'forgot-password'
}

export interface IResendOtp {
    email: string;
    type: ResentOtpType;
}

export interface IVerifyPayload {
    otp: number;
    email: string;
    isRememberMe: boolean;
}

export interface ILoginPayload {
    email: string;
    password: string;
    isRememberMe: boolean;
}

export interface IChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface IForgotPasswordPayload {
    email: string
}

export interface IVerifyForgotPasswordPayload {
    email: string;
    otp: number;
}

export interface IresetForgotPasswordPayload {
    newPassword: string;
    resetToken: string;
}

// Google OAuth controller 

export interface IroleCookiePayload {
    role: string
}

export interface IOAuthSignupLoginPayload {
    name: string;
    email: string;
    authType: AuthType;
    ProviderAuthId: string;
    role?: Role;
}

export interface ISetPasswordPayload {
    password: string;
    confirmPassword: string;
}


export enum ROLE {
    CANDIDATE = 'CANDIDATE',
    RECRUITER = 'RECRUITER'
}

export interface IRefreshToken {
    token: string;
    expiresAt: Date;
    userId: number;
}

export type JwtPayload = {
    sub: number;
    email: string;
    role: ROLE;
};

export type JwtVerifyPayload = {
    sub: string;
    email: string;
    role: ROLE;
};



// Controller schema

export interface ISignUpPayload {
    name: string;
    email: string;
    password: string;
    role: ROLE;
}

export enum ResentOtpType {
    signup = 'signup',
    forgotpassword = 'forgot-password'
}

export interface IResendOtp {
    email: string;
    type: ResentOtpType
}

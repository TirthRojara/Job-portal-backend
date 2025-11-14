import Joi, { optional } from 'joi';
import { IVerifyPayload, ResentOtpType, ROLEwithoutADMIN } from './auth.interface';
import { emitWarning } from 'process';
import { AuthType } from '@prisma/client';

const passwordSchema = Joi.string()
    .trim()
    .min(8)
    .pattern(/[a-z]/, 'at least one lowercase letter')
    .pattern(/[A-Z]/, 'at least one uppercase letter')
    .pattern(/[0-9]/, 'at least one number')
    .pattern(/[^a-zA-Z0-9]/, 'at least one special character')
    .required();

export const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    // password: passwordSchema,
    password: Joi.string().required(),
    role: Joi.string().valid(ROLEwithoutADMIN.CANDIDATE, ROLEwithoutADMIN.RECRUITER).required(),
    authType: Joi.string().valid(AuthType.EMAIL, AuthType.OAUTH)
});

export const resendOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string().valid(ResentOtpType.signup, ResentOtpType.forgotpassword).required().strict()
});

export const verifySchema = Joi.object({
    otp: Joi.number().required().strict(),
    email: Joi.string().email().required(),
    isRememberMe: Joi.boolean().required().strict()
});

export const logInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(1).required(),
    isRememberMe: Joi.boolean().required().strict()
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().min(1).required(),
  // newPassword: passwordSchema
  newPassword: Joi.string().min(1).required()
})

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
})

export const verifyForgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required().strict()
})

export const resetForgotPasswordSchema = Joi.object({
  // newPassword: passwordSchema
  newPassword: Joi.string().min(1).required(),
  // resetToken: Joi.string().required().strict()
})
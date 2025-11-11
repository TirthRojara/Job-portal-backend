import Joi from 'joi';
import { ResentOtpType, ROLE } from './auth.interface';
import { emitWarning } from 'process';

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
    role: Joi.string().valid(ROLE.CANDIDATE, ROLE.RECRUITER).required()
});

export const resendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  type: Joi.string().valid(ResentOtpType.signup, ResentOtpType.forgotpassword).required().strict()
})
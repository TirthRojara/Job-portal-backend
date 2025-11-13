import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authController } from './auth.controller';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import {
    changePasswordSchema,
    forgotPasswordSchema,
    logInSchema,
    resendOtpSchema,
    resetForgotPasswordSchema,
    signupSchema,
    verifyForgotPasswordSchema,
    verifySchema
} from './auth.schema';

const authRoute = express.Router();

// authRoute.post('/signup', asyncWrapper(authController.signUp));
// authRoute.post('/signin', validateSchema(logInSchema),asyncWrapper(authController.signIn));
// authRoute.get('/me', asyncWrapper(verifyUser), asyncWrapper(authController.getCurrentUser))
// authRoute.get('/me', verifyUser, asyncWrapper(authController.getCurrentUser));
// authRoute.post('/logout', asyncWrapper(verifyUser), asyncWrapper(authController.logout))
// authRoute.post('/logout', verifyUser, asyncWrapper(authController.logout));

authRoute.post('/signup', validateSchema(signupSchema), asyncWrapper(authController.signUp));

authRoute.post('/resend', validateSchema(resendOtpSchema), asyncWrapper(authController.resendOtp));

authRoute.post('/verify', validateSchema(verifySchema), asyncWrapper(authController.verify));

authRoute.post('/login', validateSchema(logInSchema), asyncWrapper(authController.login));

authRoute.post(
    '/change-password',
    verifyUser,
    validateSchema(changePasswordSchema),
    asyncWrapper(authController.changePassword)
);

authRoute.post('/getAccessToken', asyncWrapper(authController.getAccessToken));

authRoute.post('/forgot-password', validateSchema(forgotPasswordSchema), asyncWrapper(authController.forgotPassword));

authRoute.post(
    '/verify-forgot-password',
    validateSchema(verifyForgotPasswordSchema),
    asyncWrapper(authController.verifyForgotPassword)
);

authRoute.post(
    '/reset-forgot-password',
    validateSchema(resetForgotPasswordSchema),
    asyncWrapper(authController.resetForgotPassword)
);

export default authRoute;

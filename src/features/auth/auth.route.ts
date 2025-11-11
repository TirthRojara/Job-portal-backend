import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { authController } from './auth.controller';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { logInSchema } from '../user/user.schema';
import { resendOtpSchema, signupSchema } from './auth.schema';

const authRoute = express.Router();

// authRoute.post('/signup', asyncWrapper(authController.signUp));
// authRoute.post('/signin', validateSchema(logInSchema),asyncWrapper(authController.signIn));
// authRoute.get('/me', asyncWrapper(verifyUser), asyncWrapper(authController.getCurrentUser))
// authRoute.get('/me', verifyUser, asyncWrapper(authController.getCurrentUser));
// authRoute.post('/logout', asyncWrapper(verifyUser), asyncWrapper(authController.logout))
// authRoute.post('/logout', verifyUser, asyncWrapper(authController.logout));

authRoute.post('/signup', validateSchema(signupSchema), asyncWrapper(authController.signUp));

authRoute.post('/resend', validateSchema(resendOtpSchema), asyncWrapper(authController.resendOtp));

export default authRoute;

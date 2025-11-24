import express from 'express';
import { userController } from './user.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
// import { userCreateSchema } from './user.schema';

const userRouter = express.Router();

// userRouter.get('/', userController.getAll)
// userRouter.post('/', validateSchema(userCreateSchema),asyncWrapper(userController.create))

userRouter.get('/me', verifyUser, asyncWrapper(userController.getUserData));

export default userRouter;

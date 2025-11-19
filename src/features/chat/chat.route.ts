import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { chatController } from './chat.controller';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { Role } from '@prisma/client';

const chatRoute = express.Router();

chatRoute.get('/chatListForCandidate', verifyUser, allowAccess(Role.CANDIDATE), asyncWrapper(chatController.getChatListForCandidate));

chatRoute.get('/chatListForRecruiter/:companyId', verifyUser, allowAccess(Role.RECRUITER), asyncWrapper(chatController.getChatListForRecruiter));

export default chatRoute;

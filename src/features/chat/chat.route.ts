import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { chatController } from './chat.controller';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { Role } from '@prisma/client';

const chatRoute = express.Router();

// chatRoute.get(
//     '/chatListForCandidate',
//     verifyUser,
//     allowAccess(Role.CANDIDATE),
//     asyncWrapper(chatController.getChatListForCandidate)
// );

// chatRoute.get(
//     '/chatListForRecruiter/:companyId',
//     verifyUser,
//     allowAccess(Role.RECRUITER),
//     asyncWrapper(chatController.getChatListForRecruiter)
// );

// chatRoute.get(
//     '/chatForCandidate/:chatRoomId',
//     verifyUser,
//     allowAccess(Role.CANDIDATE),
//     asyncWrapper(chatController.getChatForCandidate)
// );

// chatRoute.get(
//     '/chatForRECRUITER/:companyId/:chatRoomId',
//     verifyUser,
//     allowAccess(Role.RECRUITER),
//     asyncWrapper(chatController.getChatForRECRUITER)
// );

chatRoute.get(
    '/chatList',
    verifyUser,
    allowAccess(Role.CANDIDATE, Role.RECRUITER),
    asyncWrapper(chatController.getChatList)
);

chatRoute.get(
    '/message/:chatId',
    verifyUser,
    allowAccess(Role.CANDIDATE, Role.RECRUITER),
    asyncWrapper(chatController.getMessages)
);

chatRoute.get(
    '/createChat/:companyId/:candidateProfileId',
    verifyUser,
    allowAccess(Role.CANDIDATE, Role.RECRUITER),
    asyncWrapper(chatController.createChat)
);

export default chatRoute;

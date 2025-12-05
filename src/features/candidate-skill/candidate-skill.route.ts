import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { candidateSkillController } from './candidate-skill.controller';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { candidateSkillSchema } from './candidate-skill.schema';

const candidateSkillRoute = express.Router();

candidateSkillRoute.get('/skills', verifyUser, asyncWrapper(candidateSkillController.getAllSkill));

candidateSkillRoute.post(
    '/me',
    verifyUser,
    allowAccess('CANDIDATE'),
    validateSchema(candidateSkillSchema),
    asyncWrapper(candidateSkillController.create)
);

candidateSkillRoute.get(
    '/getAllUser',
    verifyUser,
    allowAccess('ADMIN'),
    asyncWrapper(candidateSkillController.readAllUserSkill)
);

candidateSkillRoute.get(
    '/me',
    verifyUser,
    allowAccess('CANDIDATE'),
    asyncWrapper(candidateSkillController.readMySkill)
);

candidateSkillRoute.delete(
    '/me',
    verifyUser,
    allowAccess('CANDIDATE'),
    validateSchema(candidateSkillSchema),
    asyncWrapper(candidateSkillController.remove)
);

export default candidateSkillRoute;

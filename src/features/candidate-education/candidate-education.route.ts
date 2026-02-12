import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { candidateEducationController } from './candidate-education.controller';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { candidateEducationCreateSchema, candidateEducationUpdateSchema } from './candidate-education.schema';

const candidateEducationRoute = express.Router();

candidateEducationRoute.post(
    '/me',
    verifyUser,
    validateSchema(candidateEducationCreateSchema),
    asyncWrapper(candidateEducationController.create)
);

candidateEducationRoute.get(
    '/readAll',
    verifyUser,
    allowAccess('ADMIN'),
    asyncWrapper(candidateEducationController.readAll)
);

candidateEducationRoute.get('/me', verifyUser, asyncWrapper(candidateEducationController.readMyEducation));

candidateEducationRoute.get(
    `/:jobId/:candidateProfileId`,
    verifyUser,
    allowAccess('RECRUITER'),
    asyncWrapper(candidateEducationController.readEducationById)
);

candidateEducationRoute.patch(
    '/me/:id',
    verifyUser,
    validateSchema(candidateEducationUpdateSchema),
    asyncWrapper(candidateEducationController.update)
);

candidateEducationRoute.delete('/me/:id', verifyUser, asyncWrapper(candidateEducationController.remove));

export default candidateEducationRoute;

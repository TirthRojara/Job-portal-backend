import express from 'express';
import { candidateExperienceController } from './candidate-experience.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { candidateExperienceCreateSchema, candidateExperienceUpdateSchema } from './candidate-experience.schema';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';

const candidateExperienceRoute = express.Router();

candidateExperienceRoute.post(
    '/me',
    verifyUser,
    allowAccess('CANDIDATE'),
    validateSchema(candidateExperienceCreateSchema),
    asyncWrapper(candidateExperienceController.create)
);

candidateExperienceRoute.get(
    '/readAll',
    verifyUser,
    allowAccess('ADMIN'),
    asyncWrapper(candidateExperienceController.readAll)
);

candidateExperienceRoute.get(
    '/me',
    verifyUser,
    allowAccess('CANDIDATE'),
    asyncWrapper(candidateExperienceController.readMyExperience)
);

candidateExperienceRoute.patch(
    '/me/:id',
    verifyUser,
    allowAccess('CANDIDATE'),
    validateSchema(candidateExperienceUpdateSchema),
    asyncWrapper(candidateExperienceController.update)
);

candidateExperienceRoute.delete(
    '/me/:id',
    verifyUser,
    allowAccess('CANDIDATE'),
    asyncWrapper(candidateExperienceController.remove)
);

export default candidateExperienceRoute;

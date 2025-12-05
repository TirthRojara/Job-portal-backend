import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { candidateLanguageController } from './candidate-language.controller';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { candidateLanguageCreateSchema, candidateLanguageUpdateSchema } from './candidate-language.schema';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';

const candidateLanguageRoute = express.Router();

candidateLanguageRoute.post(
    '/me',
    verifyUser,
    allowAccess('CANDIDATE'),
    validateSchema(candidateLanguageCreateSchema),
    asyncWrapper(candidateLanguageController.create)
);

candidateLanguageRoute.get(
    '/readAll',
    verifyUser,
    allowAccess('ADMIN'),
    asyncWrapper(candidateLanguageController.readAll)
);

candidateLanguageRoute.get(
    '/me',
    verifyUser,
    allowAccess('CANDIDATE'),
    asyncWrapper(candidateLanguageController.readMyLanguage)
);

candidateLanguageRoute.patch(
    '/me/:languageName',
    verifyUser,
    allowAccess('CANDIDATE'),
    validateSchema(candidateLanguageUpdateSchema),
    asyncWrapper(candidateLanguageController.updateLevel)
);

candidateLanguageRoute.delete(
    '/me/:languageName',
    verifyUser,
    allowAccess('CANDIDATE'),
    asyncWrapper(candidateLanguageController.remove)
);

export default candidateLanguageRoute;

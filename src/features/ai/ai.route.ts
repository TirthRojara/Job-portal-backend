import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { aicontroller } from './ai.controller';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { aiCandidateSummarySchema, aiJobPostSchema } from './ai.schema';

const aiRoute = express.Router();

aiRoute.post(
    '/',
    verifyUser,
    allowAccess('CANDIDATE'),
    validateSchema(aiCandidateSummarySchema),
    aicontroller.generateCandidateSummary
);

aiRoute.post(
    '/jobpost',
    verifyUser,
    allowAccess('RECRUITER'),
    validateSchema(aiJobPostSchema),
    aicontroller.generateJobWithAI
);

export default aiRoute;

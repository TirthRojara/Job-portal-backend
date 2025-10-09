import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { jobBenefitController } from './job-benefit.controller';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { jobBenefitSchema } from './job-benefit.schema';

const jobBenefitRoute = express.Router();

jobBenefitRoute.post(
  '/me/:jobId',
  verifyUser,
  allowAccess('RECRUITER'),
  validateSchema(jobBenefitSchema),
  asyncWrapper(jobBenefitController.create)
);

jobBenefitRoute.get('/:jobId', verifyUser, asyncWrapper(jobBenefitController.read));

jobBenefitRoute.delete(
  '/me/:jobId/:benefitName',
  verifyUser,
  allowAccess('RECRUITER'),
  asyncWrapper(jobBenefitController.remove)
);

export default jobBenefitRoute;

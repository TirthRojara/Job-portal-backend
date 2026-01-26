import express from 'express';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { jobCreateSchema, jobUpdateSchema, jobUpdateStatusSchema } from './job.schema';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { jobController } from './job.controller';
import { SubscriptionMiddleware } from '~/globals/middlewares/checkSubscription.middleware';

const jobRoute = express.Router();

jobRoute.post(
  '/:companyId',
  verifyUser,
  allowAccess('RECRUITER'),
  SubscriptionMiddleware,
  validateSchema(jobCreateSchema),
  asyncWrapper(jobController.create)
);

jobRoute.get(
  '/readAll',
  verifyUser,
  allowAccess('ADMIN', 'CANDIDATE'),
  asyncWrapper(jobController.readAll)
);

jobRoute.get(
  '/me',
  verifyUser,
  allowAccess('RECRUITER'),
  asyncWrapper(jobController.readAllForRecruiter)
);

jobRoute.get(
  '/:id',
  verifyUser,
  asyncWrapper(jobController.readOne)
);

jobRoute.patch(
  '/me/:id/:companyId',
  verifyUser,
  allowAccess('RECRUITER'),
  validateSchema(jobUpdateSchema),
  asyncWrapper(jobController.update)
);

jobRoute.delete(
  '/me/delete/:id/:companyId',
  verifyUser,
  allowAccess('RECRUITER'),
  asyncWrapper(jobController.remove)
);

jobRoute.patch(
  '/me/status/:id/:companyId',
  verifyUser,
  allowAccess('RECRUITER'),
  validateSchema(jobUpdateStatusSchema),
  asyncWrapper(jobController.updateStatus)
);

jobRoute.get(
  '/:jobId/view',
  verifyUser,
  allowAccess('ADMIN', 'CANDIDATE', 'RECRUITER'),
  asyncWrapper(jobController.getJobView)
);

jobRoute.post(
  '/save/:jobId',
  verifyUser,
  allowAccess('CANDIDATE'),
  asyncWrapper(jobController.toggleSaveJob)
);



export default jobRoute;

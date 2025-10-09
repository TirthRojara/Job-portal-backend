import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { jobSkillController } from './job-skill.controller';

const jobSkillRoute = express.Router();

jobSkillRoute.post(
  '/me/:jobId/:skillId',
  verifyUser,
  allowAccess('RECRUITER'),
  asyncWrapper(jobSkillController.create)
);

jobSkillRoute.get(
  '/:jobId/',
  verifyUser,
  //   allowAccess('RECRUITER'),
  asyncWrapper(jobSkillController.read)
);

jobSkillRoute.delete(
  '/me/:jobId/:skillId',
  verifyUser,
  allowAccess('RECRUITER'),
  asyncWrapper(jobSkillController.remove)
);

export default jobSkillRoute;

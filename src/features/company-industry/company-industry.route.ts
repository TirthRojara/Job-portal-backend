import express from 'express';
import { companyIndustryController } from './company-industry.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';

const companyIndustryRoute = express.Router();

companyIndustryRoute.get('/industryList', verifyUser, asyncWrapper(companyIndustryController.getAllIndustries));

companyIndustryRoute.post(
  '/me/:companyId/:industryId',
  verifyUser,
  allowAccess('RECRUITER'),
  asyncWrapper(companyIndustryController.add)
);

companyIndustryRoute.get(
  '/industry/:companyId',
  verifyUser,
  asyncWrapper(companyIndustryController.getCompanyIndustry)
);

companyIndustryRoute.delete(
  '/me/:companyId/:industryId',
  verifyUser,
  allowAccess('RECRUITER'),
  asyncWrapper(companyIndustryController.remove)
);

export default companyIndustryRoute;

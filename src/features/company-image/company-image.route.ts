import express from 'express';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { companyImageController } from './company-image.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { uploadCompanyImage } from '~/globals/helpers/upload.helper';

const companyImageRoute = express.Router();

companyImageRoute.post(
  '/me/:companyId',
  verifyUser,
  allowAccess('RECRUITER'),
  uploadCompanyImage.array('images', 3),
  asyncWrapper(companyImageController.add)
);

companyImageRoute.get('/image/:companyId', verifyUser, asyncWrapper(companyImageController.readAll));

companyImageRoute.delete(
  '/me/image/:companyId/:companyImageId',
  verifyUser,
  allowAccess('RECRUITER'),
  asyncWrapper(companyImageController.remove)
);

export default companyImageRoute;

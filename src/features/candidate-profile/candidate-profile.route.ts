import express from 'express';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { candidateProfileController } from './candidate-profile.controller';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { candidateProfile_Create_Schema, candidateProfile_Update_Schema } from './candidate-profile.schema';
import { checkPermission, checkPermission_A_R } from '~/globals/middlewares/checkPermission.middleware';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { Role } from '@prisma/client';
import { uploadCV } from '~/globals/helpers/upload.helper';

const candidateProfileRoute = express.Router();

candidateProfileRoute.post(
  '/',
  verifyUser,
  allowAccess(Role.CANDIDATE),
  uploadCV.array('cv'),    //('cv', 1)  //both are same 
  validateSchema(candidateProfile_Create_Schema),
  asyncWrapper(candidateProfileController.create)
);

// candidateProfileRoute.get('/', verifyUser, asyncWrapper(candidateProfileController.readAll))
candidateProfileRoute.get(
  '/',
  verifyUser,
  //   asyncWrapper(checkPermission_A_R), // admin, recruiter
  allowAccess('ADMIN'),
  asyncWrapper(candidateProfileController.readAll)
);

candidateProfileRoute.get('/me', verifyUser, asyncWrapper(candidateProfileController.readOne));

candidateProfileRoute.patch(
  '/update',
  verifyUser,
  validateSchema(candidateProfile_Update_Schema),
  asyncWrapper(candidateProfileController.update)
);

candidateProfileRoute.delete('/delete', verifyUser, asyncWrapper(candidateProfileController.remove));

candidateProfileRoute.get(
  '/:id',
  verifyUser,
  asyncWrapper(checkPermission('candidateProfile', 'userId')),
  asyncWrapper(candidateProfileController.readById)
);

export default candidateProfileRoute;

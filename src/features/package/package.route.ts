import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { packageController } from './package.controller';
import { packageCreateSchema, packageIsActiveSchema, packageUpdateSchema } from './package.schema';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';

const packageRoute = express.Router();

packageRoute.post(
  '/',
  verifyUser,
  allowAccess('ADMIN'),
  validateSchema(packageCreateSchema),
  asyncWrapper(packageController.create)
);

packageRoute.get('/', verifyUser, allowAccess('ADMIN'), asyncWrapper(packageController.readAll));

packageRoute.get(
  '/package',
  verifyUser,
  allowAccess('ADMIN', 'RECRUITER'),
  asyncWrapper(packageController.readAllForRecruiter)
);

packageRoute.get('/:id', verifyUser, allowAccess('ADMIN'), asyncWrapper(packageController.readOne));

packageRoute.get(
  '/package/:id',
  verifyUser,
  allowAccess('RECRUITER'),
  asyncWrapper(packageController.readOneForRecruiter)
);

packageRoute.patch(
  '/:id',
  verifyUser,
  allowAccess('ADMIN'),
  validateSchema(packageUpdateSchema),
  asyncWrapper(packageController.update)
);

packageRoute.patch(
  '/active/:id',
  verifyUser,
  allowAccess('ADMIN'),
  validateSchema(packageIsActiveSchema),
  asyncWrapper(packageController.updateStatus)
);

export default packageRoute;

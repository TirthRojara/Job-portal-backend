import express from 'express';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { jobRoleController } from './job-role.controller';
import { validateSchema } from '~/globals/middlewares/validateSchema.middleware';
import { jobRoleCreateSchema } from './job-role.schema';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';

const jobRoleRoute = express.Router();

jobRoleRoute.post(
  '/',
  verifyUser,
  allowAccess('ADMIN'),
  validateSchema(jobRoleCreateSchema),
  asyncWrapper(jobRoleController.create)
);

jobRoleRoute.get('/', verifyUser, asyncWrapper(jobRoleController.readAll));

jobRoleRoute.delete('/:jobRoleId', verifyUser, allowAccess('ADMIN'), asyncWrapper(jobRoleController.remove));

export default jobRoleRoute;

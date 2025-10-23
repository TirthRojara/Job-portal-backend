import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { recruiterPackageController } from './recruiter-package.controller';

const RecruiterPackageRoute = express.Router();

RecruiterPackageRoute.post('/:packageId', verifyUser, allowAccess('RECRUITER'), asyncWrapper(recruiterPackageController.create));

export default RecruiterPackageRoute;

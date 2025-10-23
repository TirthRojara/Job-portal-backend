import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { razorpayController } from './razorpay.controller';

const razorpayRoute = express.Router();

const rawBodyMiddleware = express.raw({ type: 'application/json' });

razorpayRoute.post(
  '/:packageId',
  //  verifyUser,
  //   allowAccess('RECRUITER'),
  asyncWrapper(razorpayController.create)
);

razorpayRoute.get(
  '/key',
  //   verifyUser,
  // allowAccess('RECRUITER'),
  asyncWrapper(razorpayController.getKeyId)
);

razorpayRoute.post(
  '/verifypayment',
  rawBodyMiddleware,
  //   verifyUser,
  // allowAccess('RECRUITER'),
  asyncWrapper(razorpayController.verifypayment)
);

export default razorpayRoute;

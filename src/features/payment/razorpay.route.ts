import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { razorpayController } from './razorpay.controller';

const razorpayRoute = express.Router();


razorpayRoute.post(
  '/create/:packageId',
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


// const rawBodyMiddleware = express.raw({ type: 'application/json' });
// razorpayRoute.post(
//   '/verifypayment',
//   // rawBodyMiddleware,
//   express.raw({ type: 'application/json' }),
//   asyncWrapper(razorpayController.verifypayment)
// );


// export default razorpayRoute;



const razorpayWebhookRoute = express.Router();


// const rawBodyMiddleware = express.raw({ type: 'application/json' });
// razorpayWebhookRoute.post(
//   '/verifypayment',
//   // rawBodyMiddleware,
//   express.raw({ type: 'application/json' }),
//   asyncWrapper(razorpayController.verifypayment)
// );


export default {razorpayWebhookRoute, razorpayRoute};


import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { razorpayController } from './razorpay.controller';

const razorpayRoute = express.Router();

razorpayRoute.get(
  '/key',
  //   verifyUser,
  // allowAccess('RECRUITER'),
  asyncWrapper(razorpayController.getKeyId)
);

// for one time payment 
// razorpayRoute.post(
//   '/create/:packageId',
//   //  verifyUser,
//   //   allowAccess('RECRUITER'),
//   asyncWrapper(razorpayController.create)
// );

razorpayRoute.post(
  '/subscription/create/:packageId',
  asyncWrapper(razorpayController.create)
);

razorpayRoute.post(
  '/subscription/pause/:subscriptionId',
  asyncWrapper(razorpayController.handleSubscriptionPaused)
);





// export default razorpayRoute;


//  this is for webhook routes
const razorpayWebhookRoute = express.Router();

// for one time payment 
const rawBodyMiddleware = express.raw({ type: 'application/json' });
// razorpayWebhookRoute.post(
//   '/verifypayment',
//   // rawBodyMiddleware,
//   express.raw({ type: 'application/json' }),
//   asyncWrapper(razorpayController.verifypayment)
// );

razorpayWebhookRoute.post(
  '/subscription/verify',
  rawBodyMiddleware,
  asyncWrapper(razorpayController.handleSubscriptionCharged)
);

razorpayWebhookRoute.post(
  '/subscription/pause',
  rawBodyMiddleware,
  asyncWrapper(razorpayController.handleSubscriptionPausedWebhook)
);

//  https://conchate-moistly-lucy.ngrok-free.dev/api/v1/razorpay/webhook/subscription/pause
export default {razorpayWebhookRoute, razorpayRoute};


import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { razorpayController } from './razorpay.controller';

const razorpayRoute = express.Router();

// for one time payment
// razorpayRoute.post(
//   '/create/:packageId',
//   //  verifyUser,
//   //   allowAccess('RECRUITER'),
//   asyncWrapper(razorpayController.create)
// );

razorpayRoute.get(
  '/key',
  //   verifyUser,
  // allowAccess('RECRUITER'),
  asyncWrapper(razorpayController.getKeyId)
);

// Create the subscription
razorpayRoute.post('/subscription/create/:packageId', asyncWrapper(razorpayController.create));

// Pause the subscription request
razorpayRoute.post('/subscription/pause/:subscriptionId', asyncWrapper(razorpayController.handleSubscriptionPaused));

// Resume the subscription request
razorpayRoute.post('/subscription/resume/:subscriptionId', asyncWrapper(razorpayController.handleSubscriptionResumed));

//  Cancel the subscription request
razorpayRoute.post('/subscription/cancel/:subscriptionId', asyncWrapper(razorpayController.handleSubscriptionCancelled));




//  ###   this is for webhook routes    ###

const razorpayWebhookRoute = express.Router();

// for one time payment
// razorpayWebhookRoute.post(
//   '/verifypayment',
//   // rawBodyMiddleware,
//   express.raw({ type: 'application/json' }),
//   asyncWrapper(razorpayController.verifypayment)
// );

const rawBodyMiddleware = express.raw({ type: 'application/json' });

// handle activate event
razorpayWebhookRoute.post(
  '/subscription/activate',
  rawBodyMiddleware,
  asyncWrapper(razorpayController.handleSubscriptionActivatedWebhook)
);

// verify payment when charge event trigger
razorpayWebhookRoute.post(
  '/subscription/verify',
  rawBodyMiddleware,
  asyncWrapper(razorpayController.handleSubscriptionCharged)
);

// handle pause event
razorpayWebhookRoute.post(
  '/subscription/pause',
  rawBodyMiddleware,
  asyncWrapper(razorpayController.handleSubscriptionPausedWebhook)
);

// handle resume event
razorpayWebhookRoute.post(
  '/subscription/resume',
  rawBodyMiddleware,
  asyncWrapper(razorpayController.handleSubscriptionResumedWebhook)
);

// handle halted event
razorpayWebhookRoute.post(
  '/subscription/halted',
  rawBodyMiddleware,
  asyncWrapper(razorpayController.handleSubscriptionHaltedWebhook)
);

// handle cancelled event
razorpayWebhookRoute.post(
  '/subscription/cancelled',
  rawBodyMiddleware,
  asyncWrapper(razorpayController.handleSubscriptionCancelledWebhook)
);

// handle completed event
razorpayWebhookRoute.post(
  '/subscription/completed',
  rawBodyMiddleware,
  asyncWrapper(razorpayController.handleSubscriptionCompletedWebhook)
);


//  https://conchate-moistly-lucy.ngrok-free.dev/api/v1/razorpay/webhook/subscription/activate
export default { razorpayWebhookRoute, razorpayRoute };

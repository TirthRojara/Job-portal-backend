import express from 'express';
import asyncWrapper from '~/globals/cores/asyncWrapper.core';
import { allowAccess } from '~/globals/middlewares/allowAccess.middleware';
import { verifyUser } from '~/globals/middlewares/verifyUser.middleware';
import { razorpayController } from './razorpay.controller';
import { SubscriptionMiddleware } from '~/globals/middlewares/checkSubscription.middleware';
import { paymentController } from './payment.controller';

const paymentDataRoute = express.Router();

paymentDataRoute.get(
    '/subscription',
    verifyUser,
    asyncWrapper(SubscriptionMiddleware),
    asyncWrapper(paymentController.getSubscriptionData)
);

paymentDataRoute.get(
    '/payment-history',
    verifyUser,
    // asyncWrapper(SubscriptionMiddleware),
    asyncWrapper(paymentController.getPaymentHistory)
);

export default paymentDataRoute;

import Razorpay from 'razorpay';
import prisma from '~/prisma';
import * as crypto from 'crypto';

import { packageService } from '../package/package.service';
import { BadRequestException, CustomError, NotFountException } from '~/globals/cores/error.cores';

import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { Console } from 'console';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

class RazorpayService {
  public async getKeyId() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) throw new Error('Razorpay Key ID is not set in environment variables');
    return { keyId };
  }

  // public async create(packageId: number) {
  //   // public async create(packageId: number, currentUser: UserPayLoad) {

  //   try {
  //     const pkg = await packageService.readOneForRecruiter(packageId);

  //     // Step 1: Create initial order in DB without razorpayOrderId
  //     const dbOrder = await prisma.order.create({
  //       data: {
  //         // recruiterId: currentUser.id,
  //         recruiterId: 4,
  //         packageId,
  //         totalPrice: pkg.price,
  //         status: 'PENDING'
  //       }
  //     });

  //     // Step 2: Create receipt string based on DB id
  //     const receipt = `order_rcptid_${dbOrder.id}`;

  //     // Step 3: Create Razorpay order
  //     const razorpayOrder = await razorpay.orders.create({
  //       amount: Math.round(pkg.price * 100), // Amount in paise
  //       currency: 'INR',
  //       receipt,
  //       notes: {
  //         packageId: pkg.id.toString()
  //       }
  //     });

  //     // Step 4: Update DB order with razorpayOrderId and receiptId (optional)
  //     const updatedOrder = await prisma.order.update({
  //       where: { id: dbOrder.id },
  //       data: {
  //         razorpayOrderId: razorpayOrder.id,
  //         razorpayReceiptId: receipt,
  //         // razorpayPaymentId:
  //         // razorpaySignature
  //         currency: razorpayOrder.currency,
  //         attempts: razorpayOrder.attempts
  //       }
  //     });

  //     return { order: updatedOrder };
  //   } catch (error) {
  //     if (error instanceof CustomError) {
  //       throw error;
  //     }
  //     throw new BadRequestException('Error creating order: ' + error);
  //   }
  // }

  // public async verifypayment(req: any) {
  //   try {
  //     console.log('verify payment service');

  //     const body = req.body
  //     const signature = req.headers['x-razorpay-signature'];
  //     // const signature = req.get('X-Razorpay-Signature');

  //     // const isValid = validateWebhookSignature(
  //     //   body, // raw webhook payload as string
  //     //   // JSON.stringify(body),
  //     //   signature, // 'x-razorpay-signature' header value
  //     //   process.env.RAZORPAY_WEBHOOK_KEY_SECRET! // your webhook secret
  //     // );

  //     // if (!isValid) {
  //     //   throw new Error('Invalid signature');
  //     // }

  //     const expectedSignature = crypto
  //       .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_KEY_SECRET!)
  //       .update(body)
  //       .digest('hex');

  //     if (signature !== expectedSignature) {
  //       throw new BadRequestException('Invalid signature');
  //     }

  //     const event = JSON.parse(body);

  //     if (event.event === 'payment.captured') {
  //       const payment = event.payload.payment.entity;

  //       const order = await prisma.order.update({
  //         where: {
  //           razorpayOrderId: payment.order_id
  //         },
  //         data: {
  //           razorpayPaymentId: payment.id,
  //           status: 'SUCCESS'
  //         }
  //       });

  //       return order;
  //     } else if (event.event === 'payment.failed') {
  //       const payment = event.payload.payment.entity;

  //       const order = await prisma.order.update({
  //         where: {
  //           razorpayOrderId: payment.order_id
  //         },
  //         data: {
  //           razorpayPaymentId: payment.id,
  //           status: 'FAILED'
  //         }
  //       });

  //       return order;
  //     }
  //   } catch (error) {
  //     throw new BadRequestException('Error in verifying payment: ' + error);
  //   }
  // }

  public async create(packageId: number) {
    // Step 0: generate customer Id
    const customer = await razorpay.customers.create({
      name: 'testuser2',
      email: 'test2@gmail.com',
      contact: '1234999999'
    })
    console.log('customer id: ' + customer.id); 

    // Step 1: Create Subscription in Razorpay
    const razorpaySubscription = await razorpay.subscriptions.create({
      plan_id: 'plan_RbXdzxslWEISVU',
      customer_notify: true,
      customer_id: customer.id,
      total_count: 12, // For example, for 12 months
      notes: {
        packageId: packageId.toString()
      }
    } as any);

    // Step 2: Save the subscription info in DB
    const subscriptionInDb = await prisma.subscription.create({
      data: {
        razorpaySubscriptionId: razorpaySubscription.id,
        razorpayPlanId: 'plan_RbXdzxslWEISVU',
        status: SubscriptionStatus.CREATED,
        startAt: new Date(),
        totalCount: 12,
        paidCount: 0,
        recruiterId: 4,
        packageId
      }
    });

    return subscriptionInDb;
  }

  public async handleSubscriptionCharged(req: any) {
    try {
      console.log('verify subscription payment ervice');

      const body = req.body;
      const signature = req.headers['x-razorpay-signature'];
      console.log('Received body:', body);
      console.log('Received signature:', signature);

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_KEY_SECRET!)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new BadRequestException('Invalid signature');
      }

      const event = JSON.parse(body);

      const subscriptionId = event.payload.subscription.entity.id;
      const paymentId = event.payload.payment.entity.id;
      const amount = event.payload.payment.entity.amount;
      const currency = event.payload.payment.entity.currency || 'INR';
      const paidAt = new Date(event.payload.payment.entity.created_at * 1000); // convert unix time to JS Date

      if (event.event === 'subscription.charged') {
        // Step 1: Find subscription record in your DB by subscriptionId
        const subscription = await prisma.subscription.findUnique({
          where: { razorpaySubscriptionId: subscriptionId }
        });

        if (!subscription) {
          console.error('Subscription not found for ID:', subscriptionId);
          throw new NotFountException('Subscription not found');
        }

        // Step 2: Increment paidCount and update status to active
        const updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            paidCount: (subscription.paidCount || 0) + 1,
            status: SubscriptionStatus.ACTIVE,
            updatedAt: new Date()
          }
        });

        // Step 3: Log payment details in PaymentHistory
        await prisma.paymentHistory.create({
          data: {
            razorpayPaymentId: paymentId,
            razorpaySubscriptionId: subscriptionId,
            amount: amount / 100, // convert paise to actual currency value
            currency,
            status: PaymentStatus.SUCCESSFUL,
            paymentMethod: event.payload.payment.entity.method,
            createdAt: paidAt,
            userId: 4
          }
        });

        console.log('Updated subscription after payment');

        return updatedSubscription;
      } else if (event.event === 'payment.failed') {
        // Step 1: Find subscription record in your DB by subscriptionId
        const subscription = await prisma.subscription.findUnique({
          where: { razorpaySubscriptionId: subscriptionId }
        });

        if (!subscription) {
          console.error('Subscription not found for ID:', subscriptionId);
          throw new NotFountException('Subscription not found');
        }

        // Step 3: Log payment details in PaymentHistory
        const paymentHistory = await prisma.paymentHistory.create({
          data: {
            razorpayPaymentId: paymentId,
            razorpaySubscriptionId: subscriptionId,
            amount: amount / 100, // convert paise to actual currency value
            currency,
            status: PaymentStatus.FAILED,
            paymentMethod: event.payload.payment.entity.method,
            createdAt: paidAt,
            userId: 4
          }
        });

        return paymentHistory ;
      }
    } catch (error) {
      throw new BadRequestException('Error in verifying payment: ' + error);
    }
  }
}

export const razorpayService: RazorpayService = new RazorpayService();

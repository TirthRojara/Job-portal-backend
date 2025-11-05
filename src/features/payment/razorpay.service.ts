import Razorpay from 'razorpay';
import prisma from '~/prisma';
import * as crypto from 'crypto';

import { packageService } from '../package/package.service';
import { BadRequestException, CustomError, NotFountException } from '~/globals/cores/error.cores';

import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { PaymentStatus, RecruiterPackageStatus, Subscription, SubscriptionStatus } from '@prisma/client';
import subscriptions from 'razorpay/dist/types/subscriptions';

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
    // Step 1: Create Subscription in Razorpay
    const razorpaySubscription = await razorpay.subscriptions.create({
      plan_id: 'plan_RbXdzxslWEISVU',
      customer_notify: true,
      total_count: 12, // For example, for 12 months
      notes: {
        packageId: packageId.toString()
      }
    });

    // Step 2: Save the subscription info in DB
    const subscriptionInDb = await prisma.subscription.create({
      data: {
        razorpaySubscriptionId: razorpaySubscription.id,
        razorpayPlanId: 'plan_RbXdzxslWEISVU', // pro
        // razorpayPlanId: 'plan_RbXdUGA4Fw0vmf',   // basic
        status: SubscriptionStatus.CREATED,
        startAt: new Date(),
        totalCount: 12,
        paidCount: 0,
        recruiterId: 4,
        packageId
      }
    });

    console.log('subscription created');

    return subscriptionInDb;
  }

  private verifySignature(body: string, signature: string): any {
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) throw new BadRequestException('Invalid signature');

    return JSON.parse(body);
  }

  private async findSubscription(subscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { razorpaySubscriptionId: subscriptionId }
    });

    if (!subscription) throw new NotFountException('Subscription not found');
    return subscription;
  }

  private async updateSubscriptionStatusforCharge(subscription: Subscription) {
    return await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        paidCount: (subscription.paidCount || 0) + 1,
        status: SubscriptionStatus.ACTIVE,
        updatedAt: new Date()
      }
    });
  }

  private async logPaymentHistory(event: any, subscriptionId: string) {
    const payment = event.payload.payment.entity;
    return await prisma.paymentHistory.create({
      data: {
        razorpayPaymentId: payment.id,
        razorpaySubscriptionId: subscriptionId,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: PaymentStatus.SUCCESSFUL,
        paymentMethod: payment.method,
        createdAt: new Date(payment.created_at * 1000),
        userId: 4
      }
    });
  }

  private async addRecruiterPackage(event: any) {
    const recruiterPackage = await prisma.recruiterPackage.findFirst({
      where: { userId: 4 }
    });

    const subscription = event.payload.subscription.entity;

    if (recruiterPackage) {
      return await prisma.recruiterPackage.update({
        where: { userId: recruiterPackage.userId },
        data: {
          startDate: new Date(subscription.start_at * 1000),
          endDate: new Date(subscription.end_at * 1000),
          razorpaySubscriptionId: subscription.id,
          status: RecruiterPackageStatus.ACTIVE
        }
      });
    } else if (recruiterPackage == null || !recruiterPackage) {
      return await prisma.recruiterPackage.create({
        data: {
          startDate: new Date(subscription.start_at * 1000),
          endDate: new Date(subscription.end_at * 1000),
          razorpaySubscriptionId: subscription.id,
          status: RecruiterPackageStatus.ACTIVE,
          userId: 4,
          packageId: Number(subscription.notes.packageId)
        }
      });
    }
  }

  private async handleSubscriptionChargedEvent(event: any) {
    const subscriptionId = event.payload.subscription.entity.id;
    const subscription = await this.findSubscription(subscriptionId);
    await this.updateSubscriptionStatusforCharge(subscription);
    const paymentHistory = await this.logPaymentHistory(event, subscriptionId);
    await this.addRecruiterPackage(event);

    console.log('Updated subscription after payment');
    console.log('subscription is ACTIVE');

    return paymentHistory;
  }

  private async handlePaymentFailedEvent(event: any) {
    const payment = event.payload.payment.entity;

    const paymentHistory = await prisma.paymentHistory.create({
      data: {
        razorpayPaymentId: payment.id,
        // razorpaySubscriptionId can be passed separately if available
        amount: payment.amount / 100,
        currency: payment.currency,
        status: PaymentStatus.FAILED,
        paymentMethod: event.payload.payment.entity.method,
        createdAt: new Date(payment.created_at * 1000),
        userId: 4
      }
    });

    return paymentHistory;
  }

  public async handleSubscriptionCharged(req: any) {
    try {
      console.log('verify subscription payment service');

      const event = this.verifySignature(req.body, req.headers['x-razorpay-signature']);
      if (event.event === 'subscription.charged') return await this.handleSubscriptionChargedEvent(event);
      if (event.event === 'payment.failed') return await this.handlePaymentFailedEvent(event);
    } catch (error) {
      throw new BadRequestException('Error in verifying payment: ' + error);
    }
  }

  public async handleSubscriptionPaused(req: any, subscriptionId: string) {
    try {
      razorpay.subscriptions.pause(subscriptionId, { pause_at: 'now' });
      console.log('Paused request send for subscription : ' + subscriptionId);
    } catch (error) {
      throw new BadRequestException('Error while Pausing the subscription : ' + error);
    }
  }

  private async updateSubscripitonStatus(status: SubscriptionStatus, subscriptionId: string) {
    return await prisma.subscription.update({
      where: {razorpaySubscriptionId: subscriptionId},
      data: {
        status
      }
    })
  }

  public async handleSubscriptionPausedWebhook(req: any) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const body = req.body;

      const event = this.verifySignature(body, signature);

      if (event.event === 'subscription.paused') {
        const subscription = event.payload.subscription.entity;
       
        this.updateSubscripitonStatus(SubscriptionStatus.PAUSED, subscription.id)

        console.log(`Subscription paused: ${subscription.id}`);
      }
    } catch (error) {
      throw new BadRequestException('Error while Pausing the subscription in payment gateway : ' + error);
    }
  }
}

export const razorpayService: RazorpayService = new RazorpayService();

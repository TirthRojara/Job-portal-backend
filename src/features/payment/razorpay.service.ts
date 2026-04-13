import Razorpay from 'razorpay';
import prisma from '~/prisma';
import * as crypto from 'crypto';

import { packageService } from '../package/package.service';
import { BadRequestException, CustomError, NotFountException } from '~/globals/cores/error.cores';

import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { PaymentStatus, RecruiterPackageStatus, Subscription, SubscriptionStatus } from '@prisma/client';
import subscriptions from 'razorpay/dist/types/subscriptions';
import { canBuyPlan } from '~/globals/helpers/canBuyPlan.helper';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

class RazorpayService {
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

    public async getKeyId() {
        const keyId = process.env.RAZORPAY_KEY_ID;
        if (!keyId) throw new Error('Razorpay Key ID is not set in environment variables');
        return { keyId };
    }

    //  # create subscription

    public async create(packageId: number, recruiterPackage: RecruiterPackagePayload) {
        console.log('razorpay service packageId', packageId);
        console.log('razorpay service recruiterPackage', recruiterPackage);

        // check if can buy plan
        const option = await canBuyPlan(packageId, recruiterPackage);

        console.log('can buy plan', option);

        if (!('plan_id' in option)) throw new Error(String(option));

        console.log('after plan id if');
        // // Step 1: Create Subscription in Razorpay
        const razorpaySubscription = await razorpay.subscriptions.create(option);

        console.log('after step 1');

        // Step 2: Save the subscription info in DB
        const subscriptionInDb = await prisma.subscription.create({
            data: {
                razorpaySubscriptionId: razorpaySubscription.id,
                razorpayPlanId: option.plan_id,
                status: SubscriptionStatus.CREATED,
                startAt: new Date(),
                totalCount: 12,
                paidCount: 0,
                recruiterId: recruiterPackage.userId,
                packageId
            }
        });

        console.log('after step 2');

        console.log('subscription created');

        return subscriptionInDb;
    }

    //  # handle subcription authenticated event

    public async handleSubscriptionAuthenticatedWebhook(req: any) {
        try {
            console.log('body ', req.body);

            const event = this.verifySignature(req.body, req.headers['x-razorpay-signature']);

            if (event.event === 'subscription.authenticated') {
                const subscription = event.payload.subscription.entity;

                const endDate = new Date(subscription.charge_at * 1000);
                endDate.setDate(endDate.getDate() + 1); // Add one day

                await prisma.recruiterPackage.update({
                    where: { userId: Number(subscription.notes.userId) },
                    data: {
                        status: RecruiterPackageStatus.ACTIVE,
                        startDate: new Date(subscription.start_at * 1000),
                        // endDate: new Date(subscription.end_at * 1000),
                        endDate,
                        razorpaySubscriptionId: subscription.id,
                        packageId: Number(subscription.notes.packageId)
                    }
                });

                const subscriptionId = event.payload.subscription.entity.id;

                const subscriptionData = await this.findSubscription(subscriptionId);
                await this.updateSubscriptionforCharge(subscriptionData, event);

                console.log(`Subscription authenticated successfully: ${subscription.id}`);
            }
        } catch (error) {
            throw new BadRequestException('Error in authenticating the subscription in payment gateway : ' + error);
        }
    }

    //  # handle subcription activated event

    public async handleSubscriptionActivatedWebhook(req: any) {
        try {
            const event = this.verifySignature(req.body, req.headers['x-razorpay-signature']);

            if (event.event === 'subscription.activated') {
                const subscription = event.payload.subscription.entity;

                this.updateSubscripitonStatus(SubscriptionStatus.ACTIVE, subscription.id, event);

                console.log(`Subscription activated successfully: ${subscription.id}`);
            }
        } catch (error) {
            throw new BadRequestException('Error while activating the subscription in payment gateway : ' + error);
        }
    }

    //  # handle subscription charged webhook

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

    private async updateSubscriptionforCharge(subscription: Subscription, event: any) {
        return await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                paidCount: (subscription.paidCount || 0) + 1,
                updatedAt: new Date(),
                nextPayment: new Date(event.payload.subscription.entity.charge_at * 1000)
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
                userId: Number(event.payload.subscription.entity.notes.userId)
            }
        });
    }

    private async addRecruiterPackage(event: any) {
        const subscription = event.payload.subscription.entity;

        const recruiterPackage = await prisma.recruiterPackage.findUnique({
            where: { userId: Number(subscription.notes.userId) }
        });

        const endDate = new Date(subscription.charge_at * 1000); // Convert seconds to milliseconds
        endDate.setDate(endDate.getDate() + 1); // Add one day

        if (recruiterPackage) {
            return await prisma.recruiterPackage.update({
                where: { userId: recruiterPackage.userId },
                data: {
                    startDate: new Date(subscription.start_at * 1000),
                    // endDate: new Date(subscription.end_at * 1000),
                    endDate,
                    razorpaySubscriptionId: subscription.id,
                    status: RecruiterPackageStatus.ACTIVE,
                    packageId: Number(subscription.notes.packageId)
                }
            });
        }
    }

    private async handleSubscriptionChargedEvent(event: any) {
        const subscriptionId = event.payload.subscription.entity.id;

        const subscription = await this.findSubscription(subscriptionId);
        await this.updateSubscriptionforCharge(subscription, event);
        const paymentHistory = await this.logPaymentHistory(event, subscriptionId);
        await this.addRecruiterPackage(event);

        console.log('Updated subscription after payment');
        console.log('subscription is ACTIVE');

        return paymentHistory;
    }

    private async handlePaymentFailedEvent(event: any) {
        const payment = event.payload.payment.entity;

        // console.log('Full event:', JSON.stringify(event, null, 2));

        const subscriptionId = payment.notes.razorpaySubscriptionId;

        if (!subscriptionId) {
            throw new Error('Subscription ID not found in payment.failed webhook');
        }

        const subscription = await this.findSubscription(subscriptionId);

        const paymentHistory = await prisma.paymentHistory.create({
            data: {
                razorpayPaymentId: payment.id,
                // razorpaySubscriptionId can be passed separately if available
                razorpaySubscriptionId: subscriptionId,
                amount: payment.amount / 100,
                currency: payment.currency,
                status: PaymentStatus.FAILED,
                paymentMethod: event.payload.payment.entity.method,
                createdAt: new Date(payment.created_at * 1000),
                userId: subscription.recruiterId
            }
        });

        return paymentHistory;
    }

    public async handleSubscriptionCharged(req: any) {
        try {
            console.log('verify subscription payment service');

            const event = this.verifySignature(req.body, req.headers['x-razorpay-signature']);

            console.log('event', event);

            if (event.event === 'subscription.charged') return await this.handleSubscriptionChargedEvent(event);
            if (event.event === 'payment.failed') return await this.handlePaymentFailedEvent(event);

            console.log(`verify payment successfully`);
        } catch (error) {
            throw new BadRequestException('Error in verifying payment: ' + error);
        }
    }

    //  # handle subscription paused event

    public async handleSubscriptionPaused(req: any, subscriptionId: string) {
        try {
            await razorpay.subscriptions.pause(subscriptionId, { pause_at: 'now' });
            console.log('Paused request send for subscription : ' + subscriptionId);
        } catch (error) {
            console.log({ error });
            throw new BadRequestException('Error while Pausing the subscription : ' + error);
        }
    }

    private async updateSubscripitonStatus(status: SubscriptionStatus, subscriptionId: string, event: any) {
        const newNextPayment = event.payload.subscription.entity.charge_at;
        const newDate = newNextPayment ? new Date(newNextPayment * 1000) : null;

        const update = await prisma.subscription.update({
            where: { razorpaySubscriptionId: subscriptionId },
            data: {
                status,
                nextPayment: newDate
            }
        });

        return update;
    }

    public async handleSubscriptionPausedWebhook(req: any) {
        try {
            const signature = req.headers['x-razorpay-signature'];
            const body = req.body;

            const event = this.verifySignature(body, signature);

            if (event.event === 'subscription.paused') {
                const subscription = event.payload.subscription.entity;

                this.updateSubscripitonStatus(SubscriptionStatus.PAUSED, subscription.id, event);

                console.log(`Subscription paused: ${subscription.id}`);
            }
        } catch (error) {
            throw new BadRequestException('Error while Pausing the subscription in payment gateway : ' + error);
        }
    }

    //  # handle subscription resumed event

    public async handleSubscriptionResumed(req: any, subscriptionId: string) {
        try {
            razorpay.subscriptions.resume(subscriptionId, { resume_at: 'now' });
            console.log('Resumed request send for subscription : ' + subscriptionId);
        } catch (error) {
            throw new BadRequestException('Error while Resuming the subscription : ' + error);
        }
    }

    public async handleSubscriptionResumedWebhook(req: any) {
        try {
            const signature = req.headers['x-razorpay-signature'];
            const body = req.body;

            const event = this.verifySignature(body, signature);

            if (event.event === 'subscription.resumed') {
                const subscription = event.payload.subscription.entity;
                console.log('subscription: in resume webhoook', subscription);

                this.updateSubscripitonStatus(SubscriptionStatus.ACTIVE, subscription.id, event);

                console.log(`Subscription resumed successfully: ${subscription.id}`);
            }
        } catch (error) {
            throw new BadRequestException('Error while Resuming the subscription in payment gateway : ' + error);
        }
    }

    //  # handle subscription halted event

    public async handleSubscriptionHaltedWebhook(req: any) {
        try {
            const event = this.verifySignature(req.body, req.headers['x-razorpay-signature']);

            if (event.event === 'subscription.halted') {
                const subscription = event.payload.subscription.entity;

                this.updateSubscripitonStatus(SubscriptionStatus.HALTED, subscription.id, event);

                console.log(`Subscription is Halted: ${subscription.id}`);
            }
        } catch (error) {
            throw new BadRequestException('Error in halt the subscription in payment gateway : ' + error);
        }
    }

    //  # handle subscripition Cancel event

    public async handleSubscriptionCancelled(req: any, subscriptionId: string) {
        try {
            razorpay.subscriptions.cancel(subscriptionId, false);
            console.log('Cancel request send for subscription : ' + subscriptionId);
        } catch (error) {
            throw new BadRequestException('Error while cancelling the subscription : ' + error);
        }
    }

    public async handleSubscriptionCancelledWebhook(req: any) {
        try {
            const event = this.verifySignature(req.body, req.headers['x-razorpay-signature']);

            if (event.event === 'subscription.cancelled') {
                const subscription = event.payload.subscription.entity;

                this.updateSubscripitonStatus(SubscriptionStatus.CANCELLED, subscription.id, event);

                console.log(`Subscription cancelled successfully: ${subscription.id}`);
            }
        } catch (error) {
            throw new BadRequestException('Error while Resuming the subscription in payment gateway : ' + error);
        }
    }

    //  # handle subcription complete event

    public async handleSubscriptionCompletedWebhook(req: any) {
        try {
            const event = this.verifySignature(req.body, req.headers['x-razorpay-signature']);

            if (event.event === 'subscription.completed') {
                const subscription = event.payload.subscription.entity;

                this.updateSubscripitonStatus(SubscriptionStatus.COMPLETED, subscription.id, event);

                console.log(`Subscription completed successfully: ${subscription.id}`);
            }
        } catch (error) {
            throw new BadRequestException('Error in completing the subscription in payment gateway : ' + error);
        }
    }

    // # Initial payment successful → status = CREATED -> now server down
    // when server up again with in 24h then razorpay will handle it
    // But if server is down for more  than 24h
    // then fetch current status from razorpay and update in DB accordingly.
    // cron job which will run

    public async reconcileCreatedSubscriptions() {
        const BATCH_SIZE = 50;
        const CONCURRENCY = 5; // 🔥 limit parallel requests

        const subs = await prisma.subscription.findMany({
            where: {
                status: SubscriptionStatus.CREATED,
                createdAt: {
                    gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // last 2 days
                }
            },
            take: BATCH_SIZE
        });

        // helper to process one subscription
        const processSub = async (sub: any) => {
            try {
                const razorpaySub = await razorpay.subscriptions.fetch(sub.razorpaySubscriptionId);

                if (razorpaySub.status === 'active') {
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: {
                            status: SubscriptionStatus.ACTIVE,
                            paidCount: razorpaySub.paid_count,
                            nextPayment: new Date(razorpaySub.charge_at * 1000)
                        }
                    });

                    console.log('Recovered CREATED subscription:', sub.id);
                }
            } catch (error) {
                console.error('CREATED reconciliation error:', sub.id, error);
            }
        };

        // 🔥 chunk into batches (concurrency control)
        for (let i = 0; i < subs.length; i += CONCURRENCY) {
            const chunk = subs.slice(i, i + CONCURRENCY);

            await Promise.all(chunk.map(processSub));
        }
    }

    // # Renewal failed webhook due to our server down
    // when server up again with in 24h then razorpay will handle it
    // But if server is down for more  than 24h
    // check only those subscriptions which nextPayment <= now()
    // [next payment date should be future date or null, if next payment date is past date then it means renewal failed and we need to update the status in DB]
    // fetch current status from razorpay and update in DB accordingly.
    // cron job which will run

    public async reconcileRenewals() {
        const BATCH_SIZE = 50;
        const CONCURRENCY = 5;

        const subs = await prisma.subscription.findMany({
            where: {
                status: SubscriptionStatus.ACTIVE,
                nextPayment: {
                    lte: new Date()
                }
            },
            take: BATCH_SIZE
        });

        const processSub = async (sub: any) => {
            try {
                const razorpaySub = await razorpay.subscriptions.fetch(sub.razorpaySubscriptionId);

                await prisma.subscription.update({
                    where: { id: sub.id },
                    data: {
                        status: razorpaySub.status.toUpperCase() as SubscriptionStatus,
                        paidCount: razorpaySub.paid_count,
                        nextPayment: new Date(razorpaySub.charge_at * 1000)
                    }
                });

                console.log('Reconciled renewal subscription:', sub.id);
            } catch (error) {
                console.error('Renewal reconciliation error:', sub.id, error);
            }
        };

        for (let i = 0; i < subs.length; i += CONCURRENCY) {
            const chunk = subs.slice(i, i + CONCURRENCY);
            await Promise.all(chunk.map(processSub));
        }
    }
}

export const razorpayService: RazorpayService = new RazorpayService();

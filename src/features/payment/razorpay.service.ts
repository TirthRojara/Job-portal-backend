import Razorpay from 'razorpay';
import prisma from '~/prisma';
import * as crypto from 'crypto';

import { packageService } from '../package/package.service';
import { BadRequestException, CustomError } from '~/globals/cores/error.cores';

// const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils';
import { Console } from 'console';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

class RazorpayService {
  public async create(packageId: number) {
    // public async create(packageId: number, currentUser: UserPayLoad) {

    try {
      const pkg = await packageService.readOneForRecruiter(packageId);

      // Step 1: Create initial order in DB without razorpayOrderId
      const dbOrder = await prisma.order.create({
        data: {
          // recruiterId: currentUser.id,
          recruiterId: 4,
          packageId,
          totalPrice: pkg.price,
          status: 'PENDING'
        }
      });

      // Step 2: Create receipt string based on DB id
      const receipt = `order_rcptid_${dbOrder.id}`;

      // Step 3: Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(pkg.price * 100), // Amount in paise
        currency: 'INR',
        receipt,
        notes: {
          packageId: pkg.id.toString()
        }
      });

      // Step 4: Update DB order with razorpayOrderId and receiptId (optional)
      const updatedOrder = await prisma.order.update({
        where: { id: dbOrder.id },
        data: {
          razorpayOrderId: razorpayOrder.id,
          razorpayReceiptId: receipt,
          // razorpayPaymentId:
          // razorpaySignature
          currency: razorpayOrder.currency,
          attempts: razorpayOrder.attempts
        }
      });

      return { order: updatedOrder };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new BadRequestException('Error creating order: ' + error);
    }
  }

  public async getKeyId() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) throw new Error('Razorpay Key ID is not set in environment variables');
    return { keyId };
  }

  public async verifypayment(req: any) {
    try {
      console.log('verify payment service');

      const body = req.body
      const signature = req.headers['x-razorpay-signature'];
      // const signature = req.get('X-Razorpay-Signature');

      // const isValid = validateWebhookSignature(
      //   body, // raw webhook payload as string
      //   // JSON.stringify(body),
      //   signature, // 'x-razorpay-signature' header value
      //   process.env.RAZORPAY_WEBHOOK_KEY_SECRET! // your webhook secret
      // );

      // if (!isValid) {
      //   throw new Error('Invalid signature');
      // }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_KEY_SECRET!)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new BadRequestException('Invalid signature');
      }

      const event = JSON.parse(body);

      if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity;

        const order = await prisma.order.update({
          where: {
            razorpayOrderId: payment.order_id
          },
          data: {
            razorpayPaymentId: payment.id,
            status: 'SUCCESS'
          }
        });

        return order;
      } else if (event.event === 'payment.failed') {
        const payment = event.payload.payment.entity;

        const order = await prisma.order.update({
          where: {
            razorpayOrderId: payment.order_id
          },
          data: {
            razorpayPaymentId: payment.id,
            status: 'FAILED'
          }
        });

        return order;
      }
    } catch (error) {
      throw new BadRequestException('Error in verifying payment: ' + error);
    }
  }
}

export const razorpayService: RazorpayService = new RazorpayService();

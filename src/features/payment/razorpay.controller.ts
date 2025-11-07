import { Request, Response } from 'express';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { razorpayService } from './razorpay.service';
import { BadRequestException } from '~/globals/cores/error.cores';

class RazorpayController {
  // public async create(req: Request, res: Response) {
  //   const packageId = parseInt(req.params.packageId);

  //   const order = await razorpayService.create(packageId);
  //   // const order = await razorpayService.create(packageId, req.currentUser);

  //   return res.status(HTTP_STATUS.CREATED).json({
  //     message: 'Created order successfully',
  //     data: order
  //   });
  // }

  // public async verifypayment(req: Request, res: Response) {
  //   const data = await razorpayService.verifypayment(req);

  //   return res.status(HTTP_STATUS.OK).json({
  //     message: 'Payment successfully',
  //     data
  //   });
  // }

  public async getKeyId(req: Request, res: Response) {
    const keyId = await razorpayService.getKeyId();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Retrieved Razorpay key ID successfully',
      data: keyId
    });
  }

  //  # handle create subscription

  public async create(req: Request, res: Response) {
    const packageId = parseInt(req.params.packageId);
    console.log('razorpay controller packageId', packageId);
    console.log('razorpay controller req.recruiterPackage', req.recruiterPackage);

    const subscription = await razorpayService.create(packageId, req.recruiterPackage);

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created subscription successfully',
      data: subscription
    });
  }

  //  # handle subscription Authenticated event

  public async handleSubscriptionAuthenticatedWebhook(req: Request, res: Response) {
    await razorpayService.handleSubscriptionAuthenticatedWebhook(req);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Authenticated subscription successfully'
    });
  }

  //  # handle subscription activated event

  public async handleSubscriptionActivatedWebhook(req: Request, res: Response) {
    await razorpayService.handleSubscriptionActivatedWebhook(req);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Activated subscription successfully'
    });
  }

  //  # handle subscription charged event

  public async handleSubscriptionCharged(req: Request, res: Response) {

    const subscription = await razorpayService.handleSubscriptionCharged(req);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Verifying subscription payment',
      data: subscription
    });
  }

  //  # handle subscription paused event

  public async handleSubscriptionPaused(req: Request, res: Response) {
    const subscription = await razorpayService.handleSubscriptionPaused(req, req.params.subscriptionId);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Paused subscription request sent successfully'
    });
  }

  public async handleSubscriptionPausedWebhook(req: Request, res: Response) {
    const subscription = await razorpayService.handleSubscriptionPausedWebhook(req);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Paused subscription successfully',
      data: subscription
    });
  }

  //  # handle subscription resumed event

  public async handleSubscriptionResumed(req: Request, res: Response) {
    const subscription = await razorpayService.handleSubscriptionResumed(req, req.params.subscriptionId);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Resume subscription request sent successfully'
    });
  }

  public async handleSubscriptionResumedWebhook(req: Request, res: Response) {
    const subscription = await razorpayService.handleSubscriptionResumedWebhook(req);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Resumed subscription successfully',
      data: subscription
    });
  }

  //  # handle subscription halted event

  public async handleSubscriptionHaltedWebhook(req: Request, res: Response) {
    const subscription = await razorpayService.handleSubscriptionHaltedWebhook(req);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Subscription halted',
      data: subscription
    });
  }

  //  # handle subscription resumed event

  public async handleSubscriptionCancelled(req: Request, res: Response) {
    const subscription = await razorpayService.handleSubscriptionCancelled(req, req.params.subscriptionId);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Cancelled subscription request sent successfully'
    });
  }

  public async handleSubscriptionCancelledWebhook(req: Request, res: Response) {
    const subscription = await razorpayService.handleSubscriptionCancelledWebhook(req);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Cancelled subscription successfully',
      data: subscription
    });
  }

  //  # handle subscription completed event

  public async handleSubscriptionCompletedWebhook(req: Request, res: Response) {
    const subscription = await razorpayService.handleSubscriptionCompletedWebhook(req);

    return res.status(HTTP_STATUS.OK).json({
      message: 'Completed subscription successfully',
      data: subscription
    });
  }
}

export const razorpayController: RazorpayController = new RazorpayController();

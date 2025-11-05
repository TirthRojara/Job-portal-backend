import { Request, Response } from 'express';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { razorpayService } from './razorpay.service';
import { BadRequestException } from '~/globals/cores/error.cores';

class RazorpayController {
  
  public async getKeyId(req: Request, res: Response) {
    const keyId = await razorpayService.getKeyId();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Retrieved Razorpay key ID successfully',
      data: keyId
    });
  }

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


  public async create(req: Request, res: Response) {
    const packageId = parseInt(req.params.packageId);

    const subscription = await razorpayService.create(packageId);
   
    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Created subscription successfully',
      data: subscription
    });
  }

   public async handleSubscriptionCharged(req: Request, res: Response) {

    const subscription = await razorpayService.handleSubscriptionCharged(req);
   
    return res.status(HTTP_STATUS.OK).json({
      message: 'Verifying subscription payment',
      data: subscription
    });
  }

}

export const razorpayController: RazorpayController = new RazorpayController();

import { Request, Response } from 'express';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { paymentService } from './payment.service';

class PaymentController {
    public async getSubscriptionData(req: Request, res: Response) {
        const sub = await paymentService.getSubscriptionData(req.currentUser);

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get subscription data successfully',
            data: sub
        });
    }

    public async getPaymentHistory(req: Request, res: Response) {
        let { page = 1, limit = 5, filter = '' } = req.query;

        // await paymentService.getPaymentHistory(
        const {paymentHistory, totalCount, totalPages} = await paymentService.getPaymentHistory(
            { page: parseInt(page as string), limit: parseInt(limit as string) },
            req.currentUser
        );

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get payment history data successfully',
            pagination: {
                totalCount,
                currentPage: page,
                totalPages
            },
            data: paymentHistory
        });
    }
}

export const paymentController: PaymentController = new PaymentController();

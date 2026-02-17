import { Role } from '@prisma/client';
import { ForbiddenException, NotFountException } from '~/globals/cores/error.cores';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import prisma from '~/prisma';

class PaymentService {
    public async getSubscriptionData(currentUser: UserPayLoad) {
        const sub = await prisma.recruiterPackage.findUnique({
            where: {
                userId: currentUser.id
            },
            include: { package: true },
            omit: { packageId: true }
        });

        if (sub?.razorpaySubscriptionId !== null) {
            const chargedAt = await prisma.subscription.findUnique({
                where: { razorpaySubscriptionId: sub?.razorpaySubscriptionId },
                select: { nextPayment: true, status: true }
            });

            return { sub, chargedAt };
        }

        const chargedAt = {
            nextPayment: null,
            status: null
        };

        return { sub, chargedAt };
    }

    public async getPaymentHistory({ page, limit }: { page: number; limit: number }, currentUser: UserPayLoad) {
        if (currentUser.role !== Role.RECRUITER) throw new ForbiddenException(`You don't have the access.`);

        // const paymentHistory = await prisma.paymentHistory.findMany({
        //     where: { userId: currentUser.id },
        //     omit: { userId: true },
        //     orderBy: { createdAt: 'desc' }
        // });

        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            // filter: '',
            filterFields: [],
            entity: 'paymentHistory',
            additionCondition: { userId: currentUser.id },
            orderCondition: { createdAt: 'desc' },
            omit: { userId: true }
        });

        if (!data) throw new NotFountException('No data found.');

        const enrichedPayments = data.map((payment: any) => ({
            ...payment,
            plan: payment.amount === 399 ? 'BASIC' : payment.amount === 699 ? 'PRO' : 'UNKNOWN'
        }));

        return { paymentHistory: enrichedPayments, totalCount, totalPages };
    }
}

export const paymentService: PaymentService = new PaymentService();

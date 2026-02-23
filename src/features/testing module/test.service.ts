import { Company } from '@prisma/client';
import { Resend } from 'resend';
import { BadRequestException } from '~/globals/cores/error.cores';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import prisma from '~/prisma';
// import { sendMail } from '~/globals/helpers/sendMail.helper';

class TestService {
    public async test() {
        console.log('This is a test service method');

        // try {
        //   const result = await sendMail('work.tirthrojara@gmail.com', 'Test Subject', 'This is a test message');
        //   console.log('Test email sent');

        //   return result;
        // } catch (err) {
        //     console.error('Error sending test email:', err);
        //     // throw new BadRequestException(`Can't send the email \n ${err}`);
        // }

        // const resend = new Resend(process.env.RESEND_API_KEY);

        // const response =await  resend.emails.send({
        //   from: 'onboarding@resend.dev',
        //   to: 'tirth744clg@gmail.com',
        //   subject: 'Hello World',
        //   html: '<p><strong>first email</strong>!</p> this is send from backend'
        // });

        // console.log(response)

        // const test = await prisma.subscription.findMany({
        //     select: { nextPayment: true}
        // })

        // const { data, totalCount, totalPages } = await getPaginationAndFilter({
        //     page: 1,
        //     limit: 10,
        //     filter: '',
        //     filterFields: [],
        //     entity: 'chat',
        //     additionCondition: { companyId: 26 },
        //     orderCondition: { updateAt: 'desc' },
        //     include: {},
        //     select: {
        //         id: true,
        //         candidateProfileId: true,
        //         companyId: true,
        //         chatRoomId: true
        //     }
        // });

        // const chat = await prisma.chat.findMany({
        //     where: { companyId: 26 },
        //     orderBy: { updateAt: 'desc' },
        //     // select: {
        //     //     candidateProfile: { select: { fullName: true}}
        //     // }
        //     include: {
        //         company: { select: { id: true, name: true } }
        //     }
        // });

        // return chat;

        // if (currentUser.role === Role.CANDIDATE) {
        // const candidateProfile = await prisma.candidateProfile.findUnique({
        //     where: { id:   },
        //     select: { id: true }
        // });

        // return prisma.chat.aggregate({
        //     where: { candidateProfileId: 22 },
        //     _sum: { candidateUnreadCount: true }
        // });

        // if (currentUser.role === Role.RECRUITER) {
            return prisma.chat.aggregate({
                where: { companyId: 26 },
                _sum: { companyUnreadCount: true }
            });
        // }
    }
}

export const testService: TestService = new TestService();

import { Company } from '@prisma/client';
import { Resend } from 'resend';
import { BadRequestException } from '~/globals/cores/error.cores';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import prisma from '~/prisma';
// import { sendMail } from '~/globals/helpers/sendMail.helper';

// CREATE IMAGE
// docker compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache

// COMPOSE
// docker compose -f docker-compose.yml -f docker-compose.dev.yml up

//stop and remove the containers
// docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v

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

        // const chats = await prisma.chat.findMany({
        //     where: { companyId: 26 },
        //     select: { candidateProfile: { select: { userId: true } } }
        // });

        // console.log({ chats });

        // const relatedUserIds = new Set<number>();

        // chats.forEach((chat: any) => {
        //     const otherUserId = chat.candidateProfile!.userId;

        //     console.log({ otherUserId });

        //     relatedUserIds.add(otherUserId);
        // });


        // $ node -> v22.14.0
        // docker pull node:22-alpine

        // postgres:16
        // docker pull postgres:16-alpine
        
        // redis:7-alpine
        // docker pull redis:7-alpine

    }
}

export const testService: TestService = new TestService();

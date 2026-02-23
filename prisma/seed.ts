import { Education, Language, PrismaClient, Skill } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    async function createLanguageData() {
        const data: Language[] = [{ name: 'english' }, { name: 'hindi' }, { name: 'gujarati' }];

        await prisma.language.createMany({
            data,
            skipDuplicates: true
        });
    }

    async function createEducationData() {
        const data = [
            {
                name: 'Harvard University',
                map: 'https://maps.app.goo.gl/S9XNcoozcmWp5znL7'
            },
            {
                name: 'Stanford University',
                map: 'https://maps.app.goo.gl/49sahvX93NuwFaXY8'
            },
            {
                name: 'California Institute of Technology',
                map: 'https://maps.app.goo.gl/qxn9bG5mQVr7894P9'
            }
        ];

        await prisma.education.createMany({
            data,
            skipDuplicates: true
        });
    }

    async function createSkillData() {
        const data = [
            { name: 'JavaScript' },
            { name: 'TypeScript' },
            { name: 'Java' },
            { name: 'C++' },
            { name: 'C#' },
            { name: 'C' },
            { name: 'HTML' },
            { name: 'CSS' },
            { name: 'Python' },
            { name: 'ReactJs' },
            { name: 'NodeJs' },
            { name: 'ExpressJs' },
            { name: 'NextJs' }
        ];

        await prisma.skill.createMany({
            data,
            skipDuplicates: true
        });
    }

    async function createIndustryData() {
        const data = [
            { name: 'IT' },
            { name: 'Finance' },
            { name: 'Healthcare' },
            { name: 'Education' },
            { name: 'Retail' }
        ];

        await prisma.industry.createMany({
            data,
            skipDuplicates: true
        });
    }

    async function createJobRoleData() {
        const data = [{ name: 'internship' }, { name: 'fresher' }, { name: 'junior' }, { name: 'senior' }];

        await prisma.jobRole.createMany({
            data,
            skipDuplicates: true
        });
    }

    async function createBenefitData() {
        const data = [
            { name: 'medical converage' },
            { name: 'dental insurance' },
            { name: 'vision insurance' },
            { name: 'life insurance' },
            { name: 'mental health coverage' }
        ];

        await prisma.benefit.createMany({
            data,
            skipDuplicates: true
        });
    }

    async function chatTest() {
        console.log('🌱 Seeding started...');

        // ---- Create Chats ----
        const chat1 = await prisma.chat.create({
            data: {
                companyId: 26,
                candidateProfileId: 22,
                chatRoomId: 'chat_26_22',
                lastMessage: 'Hello Rahul',
                lastMessageAt: new Date('2026-02-20T10:00:00Z'),
                companyUnreadCount: 1
            }
        });

        const chat2 = await prisma.chat.create({
            data: {
                companyId: 26,
                candidateProfileId: 23,
                chatRoomId: 'chat_26_23',
                lastMessage: 'Interview scheduled',
                lastMessageAt: new Date('2026-02-20T11:00:00Z'),
                candidateUnreadCount: 2
            }
        });

        const chat3 = await prisma.chat.create({
            data: {
                companyId: 26,
                candidateProfileId: 24,
                chatRoomId: 'chat_26_24',
                lastMessage: 'Please send resume',
                lastMessageAt: new Date('2026-02-20T12:00:00Z')
            }
        });

        const chat4 = await prisma.chat.create({
            data: {
                companyId: 29,
                candidateProfileId: 20,
                chatRoomId: 'chat_29_20',
                lastMessage: 'Offer letter sent',
                lastMessageAt: new Date('2026-02-21T09:00:00Z')
            }
        });

        const chat5 = await prisma.chat.create({
            data: {
                companyId: 29,
                candidateProfileId: 26,
                chatRoomId: 'chat_29_26',
                lastMessage: 'Waiting for response',
                lastMessageAt: new Date('2026-02-21T10:30:00Z')
            }
        });

        // ---- Create Messages ----
        await prisma.message.createMany({
            data: [
                {
                    chatId: chat1.id,
                    senderId: 26,
                    receiverId: 22,
                    content: 'Hello Rahul',
                    createdAt: new Date('2026-02-20T10:00:00Z')
                },
                {
                    chatId: chat1.id,
                    senderId: 22,
                    receiverId: 26,
                    content: 'Hello Sir',
                    isRead: true,
                    createdAt: new Date('2026-02-20T10:05:00Z')
                },
                {
                    chatId: chat2.id,
                    senderId: 26,
                    receiverId: 23,
                    content: 'Interview scheduled for Monday',
                    createdAt: new Date('2026-02-20T11:00:00Z')
                },
                {
                    chatId: chat3.id,
                    senderId: 26,
                    receiverId: 24,
                    content: 'Please send resume',
                    createdAt: new Date('2026-02-20T12:00:00Z')
                },
                {
                    chatId: chat4.id,
                    senderId: 29,
                    receiverId: 20,
                    content: 'Offer letter sent',
                    createdAt: new Date('2026-02-21T09:00:00Z')
                },
                {
                    chatId: chat5.id,
                    senderId: 26,
                    receiverId: 29,
                    content: 'I will respond soon',
                    isRead: false,
                    createdAt: new Date('2026-02-21T10:30:00Z')
                }
            ]
        });

        console.log('✅ Seeding finished.');
    }

    // chatTest();
    // createLanguageData();
    // createEducationData();
    // createSkillData();
    // createIndustryData();
    // createJobRoleData();
    // createBenefitData();
}

main()
    .then()
    .catch((err) => console.log(err));

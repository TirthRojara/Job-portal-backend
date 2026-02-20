import { CandidateProfile, Role } from '@prisma/client';
import { RedisKey } from '~/globals/constants/redis.constant';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '~/globals/cores/error.cores';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import prisma from '~/prisma';

class ChatService {
    public async getChatListForCandidate({ page, limit }: { page: number; limit: number }, currentUser: UserPayLoad) {
        // const cacheData = await redisClient.get(RedisKey.CHAT.LIST(currentUser.id, page));
        // if (cacheData) return JSON.parse(cacheData);

        if (currentUser.role !== Role.CANDIDATE)
            throw new ForbiddenException('you must be a candidate to perform this action');

        const candidateProfile = await prisma.candidateProfile.findUnique({
            where: { userId: currentUser.id },
            select: { id: true }
        });

        if (!candidateProfile) throw new BadRequestException('Invalid request');

        const {
            data,
            totalCount,
            totalPages
        } = await getPaginationAndFilter({
            page,
            limit,
            filter: '',
            filterFields: [],
            entity: 'chat',
            additionCondition: { candidateProfileId: candidateProfile.id },
            orderCondition: { updateAt: 'desc' },
            include: {
                company: { select: { id: true, name: true } }
            }
            // include: {
            //     candidateProfile: { select: { fullName: true } }
            // }
            // select: {
            //     id: true,
            //     candidateProfileId: true,
            //     companyId: true,
            //     chatRoomId: true
            // }
        });

        // console.log('chat data :', data);

        // const transformedResponse = {
        //     ...response,
        //     data: response.data?.map(({ company, ...rest }: any) => ({
        //         ...rest,
        //         candidateProfile: {
        //             fullName: company.name
        //         }
        //     }))
        // };

        // console.log({transformedResponse})

        // redisClient
        //     .set(RedisKey.CHAT.LIST(currentUser.id, page), JSON.stringify({ chat: data, totalCount, totalPages }), 'EX', 7200)
        //     .catch((err) => console.error('Redis set failed', err));

        return { chat: data , totalCount, totalPages };
    }

    public async getChatListForRecruiter(
        { page, limit }: { page: number; limit: number },
        currentUser: UserPayLoad,
        companyId: number
    ) {
        // const cacheData = await redisClient.get(RedisKey.CHAT.LIST(currentUser.id, page));
        // if (cacheData) return JSON.parse(cacheData);

        const isUserHasCompany = await prisma.company.findUnique({
            where: { id: companyId, userId: currentUser.id },
            select: { id: true }
        });

        if (!isUserHasCompany) throw new BadRequestException('Invalid request');

        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter: '',
            filterFields: [],
            entity: 'chat',
            additionCondition: { companyId: isUserHasCompany.id },
            orderCondition: { updateAt: 'desc' },
            include: {
                candidateProfile: { select: { fullName: true } }
            }
            // select: {
            //     id: true,
            //     candidateProfileId: true,
            //     companyId: true,
            //     chatRoomId: true
            // }
        });

        // redisClient
        //     .set(RedisKey.CHAT.LIST(currentUser.id, page), JSON.stringify({ chat: data, totalCount, totalPages }), 'EX', 7200)
        //     .catch((err) => console.error('Redis set failed', err));

        return { chat: data, totalCount, totalPages };
    }

    public async getChatForCandidate(currentUser: UserPayLoad, chatRoomId: string) {
        const candidateProfile = await prisma.candidateProfile.findUnique({
            where: { userId: currentUser.id },
            select: { id: true, fullName: true }
        });

        if (!candidateProfile) throw new BadRequestException('Invalid request');

        const chat = await prisma.chat.findUnique({
            where: { candidateProfileId: candidateProfile.id, chatRoomId }
            // include: {
            //     candidateProfile: { select: { fullName: true } }
            // }
        });

        const company = await prisma.company.findUnique({
            where: { id: Number(chatRoomId.split('_')[1]) },
            select: { id: true, name: true }
        });

        const data = {
            ...chat,
            candidateProfile: {
                fullName: company?.name
            }
        };

        if (chat === null) {
            const data = {
                candidateProfileId: candidateProfile.id,
                companyId: Number(chatRoomId.split('_')[1]),
                chatRoomId: chatRoomId,
                messages: [],
                candidateProfile: {
                    fullName: company?.name
                }
            };

            return data;
        }

        // #### Add redis ####

        return data;
    }

    public async getChatForRECRUITER(currentUser: UserPayLoad, chatRoomId: string, companyId: number) {
        const isUserHasCompany = await prisma.company.findUnique({
            where: { id: companyId, userId: currentUser.id },
            select: { id: true }
        });

        if (!isUserHasCompany) throw new BadRequestException('Invalid request');

        const chat = await prisma.chat.findUnique({
            where: { companyId, chatRoomId },
            include: {
                candidateProfile: { select: { fullName: true } }
            }
        });

        if (chat === null) {
            const candidate = await prisma.candidateProfile.findUnique({
                where: { id: Number(chatRoomId.split('_')[2]) },
                select: { id: true, fullName: true }
            });

            const data = {
                candidateProfileId: Number(chatRoomId.split('_')[2]),
                companyId: companyId,
                chatRoomId: chatRoomId,
                messages: [],
                candidateProfile: {
                    fullName: candidate?.fullName
                }
            };

            return data;
        }

        // #### Add redis ####

        return chat;
    }
}

export const chatservice: ChatService = new ChatService();

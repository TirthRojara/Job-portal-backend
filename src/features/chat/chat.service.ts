import { CandidateProfile, Role } from '@prisma/client';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '~/globals/cores/error.cores';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import prisma from '~/prisma';

class ChatService {
    public async getChatListForCandidate({ page, limit }: { page: number; limit: number }, currentUser: UserPayLoad) {
        if (currentUser.role !== Role.CANDIDATE)
            throw new ForbiddenException('you must be a candidate to perform this action');

        const candidateProfile = await prisma.candidateProfile.findUnique({
            where: { userId: currentUser.id },
            select: { id: true }
        });

        if (!candidateProfile) throw new BadRequestException('Invalid request');

        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter: '',
            filterFields: [],
            entity: 'chat',
            additionCondition: { candidateProfileId: candidateProfile.id },
            orderCondition: { updateAt: 'desc' },
            include: {},
            select: {
                id: true,
                candidateProfileId: true,
                companyId: true,
                chatRoomId: true
            }
        });

        console.log('chat data :', data);

        return { chat: data, totalCount, totalPages };
    }

    public async getChatListForRecruiter(
        { page, limit }: { page: number; limit: number },
        currentUser: UserPayLoad,
        companyId: number
    ) {
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
            include: {},
            select: {
                id: true,
                candidateProfileId: true,
                companyId: true,
                chatRoomId: true
            }
        });

        return { chat: data, totalCount, totalPages };
    }

    public async getChatForCandidate(currentUser: UserPayLoad, chatRoomId: string) {
        const candidateProfile = await prisma.candidateProfile.findUnique({
            where: { userId: currentUser.id },
            select: { id: true }
        });

        if (!candidateProfile) throw new BadRequestException('Invalid request');

        const chat = await prisma.chat.findUnique({
            where: { candidateProfileId: candidateProfile.id, chatRoomId }
        });

        return chat;
    }

    public async getChatForRECRUITER(currentUser: UserPayLoad, chatRoomId: string, companyId: number) {
        const isUserHasCompany = await prisma.company.findUnique({
            where: { id: companyId, userId: currentUser.id },
            select: { id: true }
        });

        if (!isUserHasCompany) throw new BadRequestException('Invalid request');

        const chat = await prisma.chat.findUnique({
            where: { companyId, chatRoomId }
        });

        return chat;
    }
}

export const chatservice: ChatService = new ChatService();

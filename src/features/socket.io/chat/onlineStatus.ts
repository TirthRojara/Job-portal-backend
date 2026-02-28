import { Role } from '@prisma/client';
import { number } from 'joi';
import { Socket } from 'socket.io';
import { BadRequestException } from '~/globals/cores/error.cores';
import prisma from '~/prisma';
import { getIo } from '~/socketManager';

class PresenceService {
    private onlineUsers = new Map<number, string>(); // userId -> socketId

    markOnline(userId: number, socketId: string) {
        this.onlineUsers.set(userId, socketId);
    }

    markOffline(userId: number) {
        this.onlineUsers.delete(userId);
    }

    isOnline(userId: number) {
        return this.onlineUsers.has(userId);
    }

    getOnlineUsers() {
        return [...this.onlineUsers.keys()];
    }
}

export const presenceService = new PresenceService();

export const registerPresence = async (socket: Socket) => {
    const io = getIo();

    const userId = Number(socket.data.userId);

    // Join personal room
    const personalRoom = `user_${userId}`;
    socket.join(personalRoom);

    // Mark online
    presenceService.markOnline(userId, socket.id);

    let candidateId: number;
    let companyId: number;
    let whereCondition: any = {};

    if (socket.data.role === Role.CANDIDATE) {
        const candidate = await prisma.candidateProfile.findUnique({
            where: { userId },
            select: { id: true }
        });

        // console.log('inside check role candidate');

        if (!candidate) throw new BadRequestException('Candidate Id not found.');

        // candidateId = candidate.id;

        whereCondition.candidateProfileId = candidate.id;
    } else if (socket.data.role === Role.RECRUITER) {
        const company = await prisma.company.findFirst({
            where: { userId },
            select: { id: true }
        });

        // console.log('inside check role recruiter');

        if (!company) throw new BadRequestException('Company Id not found.');

        // companyId = company.id;

        whereCondition.companyId = company.id;
    } else {
        throw new BadRequestException('Invalid role');
    }

    // Get related users
    const chats = await prisma.chat.findMany({
        where: whereCondition,
        select:
            socket.data.role === Role.RECRUITER
                ? {
                      //   candidateProfile: { select: { userId: true } }
                      candidateProfileId: true
                  }
                : {
                      //   company: { select: { userId: true } }
                      companyId: true
                  }
    });

    const relatedUserIds = new Set<number>();

    chats.forEach((chat: any) => {
        // const otherUserId = socket.data.role === Role.RECRUITER ? chat.candidateProfile!.userId : chat.company!.userId;
        const otherUserId = socket.data.role === Role.RECRUITER ? chat.candidateProfileId : chat.companyId;

        console.log({ otherUserId });

        relatedUserIds.add(otherUserId);
    });

    const rooms = [...relatedUserIds].map((id) => `user_${id}`);

    if (rooms.length) {
        io.to(rooms).emit('userOnline', { userId });
    }

    // Handle disconnect
    socket.on('disconnect', () => {
        presenceService.markOffline(userId);

        if (rooms.length) {
            io.to(rooms).emit('userOffline', { userId });
        }
    });

    // Scoped online status check
    socket.on('getOnlineStatusForUsers', (userIds: number[], callback) => {
        const result = userIds.map((id) => ({
            userId: id,
            isOnline: presenceService.isOnline(id)
        }));

        callback(result);
    });
};

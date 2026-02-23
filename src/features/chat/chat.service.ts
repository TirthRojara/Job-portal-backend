import { CandidateProfile, Role } from '@prisma/client';
import { RedisKey } from '~/globals/constants/redis.constant';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '~/globals/cores/error.cores';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import prisma from '~/prisma';
import { getIo } from '~/socketManager';

class ChatService {
    // public async getChatListForCandidate({ page, limit }: { page: number; limit: number }, currentUser: UserPayLoad) {
    //     // const cacheData = await redisClient.get(RedisKey.CHAT.LIST(currentUser.id, page));
    //     // if (cacheData) return JSON.parse(cacheData);
    //     if (currentUser.role !== Role.CANDIDATE)
    //         throw new ForbiddenException('you must be a candidate to perform this action');
    //     const candidateProfile = await prisma.candidateProfile.findUnique({
    //         where: { userId: currentUser.id },
    //         select: { id: true }
    //     });
    //     if (!candidateProfile) throw new BadRequestException('Invalid request');
    //     const { data, totalCount, totalPages } = await getPaginationAndFilter({
    //         page,
    //         limit,
    //         filter: '',
    //         filterFields: [],
    //         entity: 'chat',
    //         additionCondition: { candidateProfileId: candidateProfile.id },
    //         orderCondition: { updateAt: 'desc' },
    //         include: {
    //             company: { select: { id: true, name: true } }
    //         }
    //         // include: {
    //         //     candidateProfile: { select: { fullName: true } }
    //         // }
    //     });
    //     // redisClient
    //     //     .set(RedisKey.CHAT.LIST(currentUser.id, page), JSON.stringify({ chat: data, totalCount, totalPages }), 'EX', 7200)
    //     //     .catch((err) => console.error('Redis set failed', err));
    //     return { chat: data, totalCount, totalPages };
    // }
    // public async getChatListForRecruiter(
    //     { page, limit }: { page: number; limit: number },
    //     currentUser: UserPayLoad,
    //     companyId: number
    // ) {
    //     // const cacheData = await redisClient.get(RedisKey.CHAT.LIST(currentUser.id, page));
    //     // if (cacheData) return JSON.parse(cacheData);
    //     const isUserHasCompany = await prisma.company.findUnique({
    //         where: { id: companyId, userId: currentUser.id },
    //         select: { id: true }
    //     });
    //     if (!isUserHasCompany) throw new BadRequestException('Invalid request');
    //     const { data, totalCount, totalPages } = await getPaginationAndFilter({
    //         page,
    //         limit,
    //         filter: '',
    //         filterFields: [],
    //         entity: 'chat',
    //         additionCondition: { companyId: isUserHasCompany.id },
    //         orderCondition: { updateAt: 'desc' },
    //         include: {
    //             candidateProfile: { select: { fullName: true } }
    //         }
    //         // select: {
    //         //     id: true,
    //         //     candidateProfileId: true,
    //         //     companyId: true,
    //         //     chatRoomId: true
    //         // }
    //     });
    //     // redisClient
    //     //     .set(RedisKey.CHAT.LIST(currentUser.id, page), JSON.stringify({ chat: data, totalCount, totalPages }), 'EX', 7200)
    //     //     .catch((err) => console.error('Redis set failed', err));
    //     return { chat: data, totalCount, totalPages };
    // }
    // public async getChatForCandidate(currentUser: UserPayLoad, chatRoomId: string) {
    //     const candidateProfile = await prisma.candidateProfile.findUnique({
    //         where: { userId: currentUser.id },
    //         select: { id: true, fullName: true }
    //     });
    //     if (!candidateProfile) throw new BadRequestException('Invalid request');
    //     const chat = await prisma.chat.findUnique({
    //         where: { candidateProfileId: candidateProfile.id, chatRoomId }
    //         // include: {
    //         //     candidateProfile: { select: { fullName: true } }
    //         // }
    //     });
    //     const company = await prisma.company.findUnique({
    //         where: { id: Number(chatRoomId.split('_')[1]) },
    //         select: { id: true, name: true }
    //     });
    //     const data = {
    //         ...chat,
    //         candidateProfile: {
    //             fullName: company?.name
    //         }
    //     };
    //     if (chat === null) {
    //         const data = {
    //             candidateProfileId: candidateProfile.id,
    //             companyId: Number(chatRoomId.split('_')[1]),
    //             chatRoomId: chatRoomId,
    //             messages: [],
    //             candidateProfile: {
    //                 fullName: company?.name
    //             }
    //         };
    //         return data;
    //     }
    //     // #### Add redis ####
    //     return data;
    // }
    // public async getChatForRECRUITER(currentUser: UserPayLoad, chatRoomId: string, companyId: number) {
    //     const isUserHasCompany = await prisma.company.findUnique({
    //         where: { id: companyId, userId: currentUser.id },
    //         select: { id: true }
    //     });
    //     if (!isUserHasCompany) throw new BadRequestException('Invalid request');
    //     const chat = await prisma.chat.findUnique({
    //         where: { companyId, chatRoomId },
    //         include: {
    //             candidateProfile: { select: { fullName: true } }
    //         }
    //     });
    //     if (chat === null) {
    //         const candidate = await prisma.candidateProfile.findUnique({
    //             where: { id: Number(chatRoomId.split('_')[2]) },
    //             select: { id: true, fullName: true }
    //         });
    //         const data = {
    //             candidateProfileId: Number(chatRoomId.split('_')[2]),
    //             companyId: companyId,
    //             chatRoomId: chatRoomId,
    //             messages: [],
    //             candidateProfile: {
    //                 fullName: candidate?.fullName
    //             }
    //         };
    //         return data;
    //     }
    //     // #### Add redis ####
    //     return chat;
    // }

    public async getChatList(
        currentUser: UserPayLoad,
        limit: number,
        companyId?: number,
        cursor?: { lastMessageAt: string; chatId: number }
    ) {
        if (currentUser.role === Role.CANDIDATE) {
            const candidateProfile = await prisma.candidateProfile.findUnique({
                where: { userId: currentUser.id },
                select: { id: true }
            });
            if (!candidateProfile) throw new BadRequestException('Invalid request');

            const chatList = await prisma.chat.findMany({
                where: { candidateProfileId: candidateProfile.id },
                include: {
                    candidateProfile: { select: { fullName: true } },
                    company: { select: { name: true } }
                },
                take: limit + 1,
                skip: cursor ? 1 : 0,
                cursor: cursor
                    ? {
                          lastMessageAt_id: {
                              lastMessageAt: new Date(cursor?.lastMessageAt),
                              id: cursor?.chatId
                          }
                      }
                    : undefined,
                orderBy: [{ lastMessageAt: 'desc' }, { id: 'desc' }]
            });

            const hasNextPage = chatList.length > limit;

            const data = hasNextPage ? chatList.slice(0, limit) : chatList;

            const nextCursor = hasNextPage
                ? {
                      lastMessageAt: data[data.length - 1].lastMessageAt,
                      id: data[data.length - 1].id
                  }
                : null;

            return {
                chatList: data,
                nextCursor
            };
        }

        if (currentUser.role === Role.RECRUITER) {
            if (!companyId) throw new BadRequestException('Invalid request. companyId params required.');

            const isUserHasCompany = await prisma.company.findUnique({
                where: { id: companyId, userId: currentUser.id },
                select: { id: true }
            });

            if (!isUserHasCompany) throw new BadRequestException('Invalid request');

            const chatList = await prisma.chat.findMany({
                where: { companyId },
                include: {
                    candidateProfile: { select: { fullName: true } },
                    company: { select: { name: true } }
                },
                take: limit + 1,
                skip: cursor ? 1 : 0,
                cursor: cursor
                    ? {
                          lastMessageAt_id: {
                              lastMessageAt: new Date(cursor?.lastMessageAt),
                              id: cursor?.chatId
                          }
                      }
                    : undefined,
                orderBy: [{ lastMessageAt: 'desc' }, { id: 'desc' }]
            });

            const hasNextPage = chatList.length > limit;

            const data = hasNextPage ? chatList.slice(0, limit) : chatList;

            const nextCursor = hasNextPage
                ? {
                      lastMessageAt: data[data.length - 1].lastMessageAt,
                      id: data[data.length - 1].id
                  }
                : null;

            return {
                chatList: data,
                nextCursor
            };
        }
    }

    public async getMessages(chatId: number, limit: number, cursor?: number) {
        // CURSOR = MESSAGE ID

        // let whereCondition: any = { chatId };

        // if (cursor) {
        //     whereCondition.id = { lt: cursor };
        // }

        //         return prisma.message.findMany({
        //     take: limit,
        //     skip: cursor ? 1 : 0,
        //     cursor: cursor ? { id: cursor } : undefined,
        //     where: { chatId },
        //     orderBy: [
        //       { createdAt: "desc" },
        //       { id: "desc" }
        //     ]
        //   });

        const messages = await prisma.message.findMany({
            // where: {
            //     chatId,
            //     ...(messageId && {
            //         id: {
            //             lt: messageId
            //         }
            //     })
            // },
            // where: whereCondition,
            // orderBy: { createdAt: 'desc' }
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            where: { chatId },
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
        });

        const reversedMessages = messages.reverse();

        const nextCursor = messages.length === limit ? messages[messages.length - 1].id : null;

        return {
            messages: reversedMessages,
            nextCursor
        };
    }

    public async createChat(companyId: number, candidateProfileId: number) {
        const createChat = await prisma.chat.upsert({
            where: {
                companyId_candidateProfileId: {
                    companyId,
                    candidateProfileId
                }
            },
            update: {},
            create: {
                companyId,
                candidateProfileId,
                chatRoomId: `chat_${companyId}_${candidateProfileId}`
            }
        });

        return createChat;
    }

    public async handleSendMessage(
        socket: any,
        { chatRoomId, chatId, message }: { chatRoomId: string; chatId: number; message: { content: string } },
        callback: any
    ) {
        try {
            const io = getIo();

            const [_, companyIdStr, candidateIdStr] = chatRoomId.split('_');

            if (!chatRoomId || !message) {
                return callback?.({ error: 'chatRoomId and message are required' });
            }

            // Optionally validate that the socket is in the room
            if (!socket.rooms.has(chatRoomId)) {
                return callback?.({ error: 'User not joined in the chat room' });
            }

            // Validate message structure (e.g., content must exist)
            if (!message.content || typeof message.content !== 'string') {
                return callback?.({ error: 'Invalid message content' });
            }

            const receiverId =
                socket.data.role === Role.CANDIDATE
                    ? Number(companyIdStr)
                    : socket.data.role === Role.RECRUITER
                      ? Number(candidateIdStr)
                      : (() => {
                            throw new Error('Invalid role');
                        })();

            let receiverUserId: number;

            if (socket.data.role === Role.CANDIDATE) {
                const company = await prisma.company.findUnique({
                    where: { id: Number(companyIdStr) },
                    select: { userId: true }
                });

                if (!company) throw new BadRequestException('Receiver Id not found.');

                receiverUserId = company?.userId;
            }

            if (socket.data.role === Role.RECRUITER) {
                const candidate = await prisma.candidateProfile.findUnique({
                    where: { id: Number(candidateIdStr) },
                    select: { userId: true }
                });

                if (!candidate) throw new BadRequestException('Receiver Id not found.');

                receiverUserId = candidate.userId;
            }

            // Check Receiver is currently in room
            const sockets = await io.in(chatRoomId).fetchSockets();

            // const isReceiverInRoom = sockets.some((s) => s.data.userId === receiverUserId);
            const isReceiverActivelyViewing = sockets.some(
                (s) => s.data.userId === receiverUserId && s.data.activeChatRoomId === chatRoomId
            );

            const createNewMessage = await prisma.$transaction(async (tx) => {
                // Create message
                const newMessage = await tx.message.create({
                    data: {
                        content: message.content,
                        senderId: socket.data.userId,
                        receiverId: receiverId,
                        chatId: chatId,
                        isRead: isReceiverActivelyViewing ? true : false
                    }
                });

                //Update chat last message
                const updateData: any = {
                    lastMessage: message.content,
                    lastMessageAt: new Date()
                };

                // If receiver is not in chatroom then increment the unread count
                if (!isReceiverActivelyViewing) {
                    if (socket.data.role === Role.CANDIDATE) {
                        updateData.companyUnreadCount = { increment: 1 };
                    } else {
                        updateData.candidateUnreadCount = { increment: 1 };
                    }
                }

                const newChat = await tx.chat.update({
                    where: { id: chatId },
                    data: updateData,
                    select: {
                        id: true,
                        lastMessage: true,
                        lastMessageAt: true,
                        companyUnreadCount: true,
                        candidateUnreadCount: true,
                        chatRoomId: true
                    }
                });

                return { newChat, newMessage };
            });

            io.to(chatRoomId).emit('newMessage', createNewMessage);

            // Acknowledge the sender
            callback?.({ success: true });
        } catch (error) {
            console.error('Error sending message:', error);
            callback?.({ error: 'Failed to send message' });
        }
    }

    public async markAsRead(
        socket: any,
        { chatId, chatRoomId }: { chatId: number; chatRoomId: string },
        callback: any
    ) {
        try {
            // Optionally validate that the socket is in the room
            if (!socket.rooms.has(chatRoomId)) {
                return callback?.({ error: 'User not joined in the chat room' });
            }

            const [_, companyIdStr, candidateIdStr] = chatRoomId.split('_');

            const receiverId =
                socket.data.role === Role.RECRUITER
                    ? Number(companyIdStr)
                    : socket.data.role === Role.CANDIDATE
                      ? Number(candidateIdStr)
                      : (() => {
                            throw new Error('Invalid role');
                        })();

            const markAsRead = await prisma.$transaction(async (tx) => {
                const updateMessage = await tx.message.updateMany({
                    where: {
                        chatId,
                        receiverId,
                        isRead: false
                    },
                    data: { isRead: true }
                });

                // Reset unread counter
                const updateData =
                    socket.data.role === Role.RECRUITER ? { companyUnreadCount: 0 } : { candidateUnreadCount: 0 };

                const newChat = await tx.chat.update({
                    where: { id: chatId },
                    data: updateData,
                    select: { id: true, companyUnreadCount: true, candidateUnreadCount: true, chatRoomId: true }
                });

                return newChat;
            });

            socket.to(chatRoomId).emit('markAsRead', markAsRead);

            // Acknowledge the sender
            callback?.({ success: true });
        } catch (error) {
            console.error('Error markAsRead messages:', error);
            callback?.({ error: 'Failed to markAsRead messages' });
        }
    }
}

export const chatservice: ChatService = new ChatService();

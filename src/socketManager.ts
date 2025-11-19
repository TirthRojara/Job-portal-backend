import { Server as SocketIOServer } from 'socket.io';
import { BadRequestException, UnauthorizedException } from './globals/cores/error.cores';
import { authService } from './features/auth/auth.service';
import { IJwtVerifyPayload } from './features/auth/auth.interface';
import { number } from 'joi';
import prisma from './prisma';
import { Role } from '@prisma/client';
import { handleJoinChat } from './features/socket.io/chat/joinChat.socket';
import { handleSendMessage } from './features/socket.io/chat/sendMessageHandler.socket';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: any): SocketIOServer => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: ['http://localhost:5173', 'https://conchate-moistly-lucy.ngrok-free.dev'], // allow both frontend origins
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const accessToken = socket.handshake.auth.token;
            if (!accessToken) {
                return next(new UnauthorizedException('Authentication error: Token required'));
            }

            const decoded = (await authService.verifyJwtToken(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET!
            )) as IJwtVerifyPayload;

            socket.data.userId = Number(decoded.sub);
            socket.data.role = decoded.role;
            next();
        } catch (error) {
            console.log('Socket auth error:', error);
            next(new UnauthorizedException('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id, 'User ID:', socket.data.userId, 'Role:', socket.data.role);

        // Join personal rooms for candidate role
        if (socket.data.role === 'CANDIDATE') {
            const candidateRoom = `candidate_${socket.data.userId}`;

            // Personal room for status updates
            socket.join(candidateRoom);

            // Personal room for new job post notifications
            // socket.join('new_job_posts');

            console.log(`Socket ${socket.id} joined personal rooms: ${candidateRoom} and new_job_posts`);
        }

        socket.on('joinChat', (params) => handleJoinChat(socket, params));
        socket.on('sendMessage', (params, callback) => handleSendMessage(socket, params, callback));

        // Chat room join handling
        // socket.on('joinChat', async ({ token, applyId }) => {
        //     try {
        //         if (!token) {
        //             return socket.emit('error', 'Authentication token required');
        //         }

        //         console.log('access token key : ', process.env.ACCESS_TOKEN_SECRET);
        //         //  verify jwt token on every room join
        //         const decoded = (await authService.verifyJwtToken(
        //             token,
        //             process.env.ACCESS_TOKEN_SECRET!
        //         )) as IJwtVerifyPayload;
        //         const { sub, role } = decoded;

        //         // Save user info for this event (optional)
        //         socket.data.userId = sub;
        //         socket.data.role = role;

        //         let companyId;
        //         let candidateProfileId;

        //         if (role === Role.CANDIDATE) {
        //             const candidateProfile = await prisma.candidateProfile.findUnique({
        //                 where: {
        //                     userId: Number(sub)
        //                 }
        //             });
        //             if (!candidateProfile)
        //                 throw new BadRequestException('Candidate profile not found, can not join the chat room');

        //             const apply = await prisma.apply.findUnique({
        //                 where: {
        //                     id: applyId,
        //                     candidateProfileId: candidateProfile!.id
        //                 }
        //             });

        //             if (!apply) throw new BadRequestException('Error while connecting the chat room');

        //             companyId = apply.companyId;
        //             candidateProfileId = candidateProfile.id;

        //             socket.data.companyId = companyId;
        //             socket.data.candidateProfileId = candidateProfileId;
        //         } else {
        //             if (role === Role.RECRUITER) {
        //                 const apply = await prisma.apply.findUnique({
        //                     where: { id: applyId }
        //                 });

        //                 if (!apply) throw new BadRequestException('Invalid applyId can not connect to the chat room');

        //                 const isVerifyJob = await prisma.job.findUnique({
        //                     where: { postById: Number(sub), id: apply.jobId }
        //                 });

        //                 if (!isVerifyJob)
        //                     throw new BadRequestException('Invalid jobId, can not connect to the chat room');

        //                 companyId = isVerifyJob.companyId;
        //                 candidateProfileId = apply.candidateProfileId;

        //                 socket.data.companyId = companyId;
        //                 socket.data.candidateProfileId = candidateProfileId;
        //             }
        //         }

        //         const chatRoomId = `chat_${companyId}_${candidateProfileId}`;
        //         socket.join(chatRoomId);
        //     } catch (error) {
        //         throw new BadRequestException(`error while joining the room \n ${error}`);
        //     }
        // });

        // // Handle sending chat messages
        // socket.on('sendMessage', async ({ chatRoomId, message }, callback) => {
        //     try {
        //         if (!chatRoomId || !message) {
        //             return callback?.({ error: 'chatRoomId and message are required' });
        //         }

        //         // Optionally validate that the socket is in the room
        //         if (!socket.rooms.has(chatRoomId)) {
        //             return callback?.({ error: 'User not joined in the chat room' });
        //         }

        //         // Validate message structure (e.g., content must exist)
        //         if (!message.content || typeof message.content !== 'string') {
        //             return callback?.({ error: 'Invalid message content' });
        //         }

        //         // Append timestamp and senderId
        //         const newMessage = {
        //             content: message.content,
        //             senderId: socket.data.userId,
        //             createdAt: new Date().toISOString()
        //         };

        //         const chat = await prisma.chat.upsert({
        //             where: { chatRoomId },
        //             create: {
        //                 chatRoomId,
        //                 candidateProfileId: socket.data.candidateProfileId,
        //                 companyId: socket.data.companyId
        //             },
        //             update: {}
        //         });

        //         const updatedMessages = Array.isArray(chat.messages) ? [...chat.messages, newMessage] : [newMessage];

        //         await prisma.chat.update({
        //             where: { chatRoomId },
        //             data: {
        //                 messages: updatedMessages
        //             }
        //         });

        //         // Broadcast the new message to all clients in the room
        //         const io = getIo();
        //         io.to(chatRoomId).emit('newMessage', newMessage);

        //         // Acknowledge the sender
        //         callback?.({ success: true });
        //     } catch (error) {
        //         console.error('Error sending message:', error);
        //         callback?.({ error: 'Failed to send message' });
        //     }
        // });

        // Log when user is leaving rooms (disconnecting event)
        socket.on('disconnecting', () => {
            socket.rooms.forEach((room) => {
                if (room !== socket.id) {
                    console.log(`User ${socket.data.userId} leaving room: ${room}`);
                }
            });
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIo = (): SocketIOServer => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

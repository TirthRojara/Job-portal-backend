import { Server as SocketIOServer } from 'socket.io';
import { BadRequestException, UnauthorizedException } from './globals/cores/error.cores';
import { authService } from './features/auth/auth.service';
import { IJwtVerifyPayload } from './features/auth/auth.interface';
import { number } from 'joi';
import prisma from './prisma';
import { Role } from '@prisma/client';
import { handleJoinChat } from './features/socket.io/chat/joinChat.socket';
import { handleSendMessage } from './features/socket.io/chat/sendMessageHandler.socket';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisPublisher, redisSubscriber } from './globals/cores/redis/redis.client';
import { chatservice } from './features/chat/chat.service';

let io: SocketIOServer | null = null;

export const initSocket = (httpServer: any): SocketIOServer => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: ['http://localhost:3000', 'https://conchate-moistly-lucy.ngrok-free.dev'], // allow both frontend origins
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            credentials: true
        }
    });

    // Plug in Redis adapter for scaling
    io.adapter(createAdapter(redisPublisher, redisSubscriber));

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

    io.on('connection', async (socket) => {
        console.log('New client connected:', socket.id, 'User ID:', socket.data.userId, 'Role:', socket.data.role);

        //personal room for all user
        const userRoom = `user_${socket.data.userId}`;
        socket.join(userRoom);
        console.log('User Join Personal room 🏠 : ', userRoom);

        // Join personal rooms for candidate role
        if (socket.data.role === 'CANDIDATE') {
            const candidateRoom = `candidate_${socket.data.userId}`;

            // Personal room for status updates
            socket.join(candidateRoom);

            // Personal room for new job post notifications
            // socket.join('new_job_posts');

            console.log(`Socket ${socket.id} joined personal rooms: ${candidateRoom} and new_job_posts`);
        }

        // CHAT HANDLES

        socket.on('joinChat', (params) => handleJoinChat(socket, params));
        // socket.on('sendMessage', (params, callback) => handleSendMessage(socket, params, callback));
        socket.on('sendMessage', (params, callback) => chatservice.handleSendMessage(socket, params, callback));

        // socket.on('chatActive', ({ chatId }) => {
        //     socket.data.activeChatRoomId = chatId;
        // });
        // socket.on('chatInactive', () => {
        //     socket.data.activeChatRoomId = null;
        // });

        socket.on('chatActive', ({ chatId }, callback) => {
            try {
                socket.data.activeChatRoomId = chatId;

                console.log('✅ chat active : ', chatId);

                callback?.({ success: true });
            } catch (error) {
                callback?.({ success: false, error: 'Failed to activate chat' });
            }
        });

        socket.on('chatInactive', (callback: (response: { success: boolean; error?: string }) => void) => {
            try {
                const inactive = socket.data.activeChatRoomId;
                socket.data.activeChatRoomId = null;

                console.log('⏸️ chat in-active : ', inactive);

                callback?.({ success: true });
            } catch (error) {
                callback?.({ success: false, error: 'Failed to deactivate chat' });
            }
        });

        socket.on('markAsRead', (params, callback) => chatservice.markAsRead(socket, params, callback));

        // Log when user is leaving rooms (disconnecting event)
        socket.on('disconnecting', () => {
            socket.rooms.forEach((room) => {
                // if (room !== socket.id) {
                if (room !== socket.id && room.startsWith('chat_')) {
                    console.log(`User ${socket.data.userId} leaving room: ${room}`);
                    console.log(`Auto leaving room on chat switch: ${room}`);
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

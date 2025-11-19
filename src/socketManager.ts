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

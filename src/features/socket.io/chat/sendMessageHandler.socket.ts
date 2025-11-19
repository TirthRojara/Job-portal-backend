// Handle sending chat messages

import prisma from '~/prisma';
import { getIo } from '~/socketManager';

// socket.on('sendMessage', async ({ chatRoomId, message }, callback) => {
export async function handleSendMessage(socket: any, { chatRoomId, message }: any, callback: any) {
    try {
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

        // Append timestamp and senderId
        const newMessage = {
            content: message.content,
            senderId: socket.data.userId,
            createdAt: new Date().toISOString()
        };

        const chat = await prisma.chat.upsert({
            where: { chatRoomId },
            create: {
                chatRoomId,
                candidateProfileId: socket.data.candidateProfileId,
                companyId: socket.data.companyId
            },
            update: {}
        });

        const updatedMessages = Array.isArray(chat.messages) ? [...chat.messages, newMessage] : [newMessage];

        await prisma.chat.update({
            where: { chatRoomId },
            data: {
                messages: updatedMessages
            }
        });

        // Broadcast the new message to all clients in the room
        const io = getIo();
        io.to(chatRoomId).emit('newMessage', newMessage);

        // Acknowledge the sender
        callback?.({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        callback?.({ error: 'Failed to send message' });
    }
}

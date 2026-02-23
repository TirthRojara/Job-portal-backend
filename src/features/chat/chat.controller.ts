import { Request, Response } from 'express';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { chatservice } from './chat.service';

class ChatController {
    // public async getChatListForCandidate(req: Request, res: Response) {
    //     let { page = 1, limit = 5 } = req.query;

    //     const { chat, totalCount, totalPages } = await chatservice.getChatListForCandidate(
    //         {
    //             page: parseInt(page as string),
    //             limit: parseInt(limit as string)
    //         },
    //         req.currentUser
    //     );

    //     console.log('chat data in controller : ', chat);

    //     return res.status(HTTP_STATUS.OK).json({
    //         message: 'Get chat list successfully',
    //         pagination: {
    //             totalCount,
    //             currentPage: page,
    //             totalPages
    //         },
    //         data: chat
    //     });
    // }

    // public async getChatListForRecruiter(req: Request, res: Response) {
    //     let { page = 1, limit = 5 } = req.query;
    //     const companyId = Number(req.params.companyId);

    //     const { chat, totalCount, totalPages } = await chatservice.getChatListForRecruiter(
    //         {
    //             page: parseInt(page as string),
    //             limit: parseInt(limit as string)
    //         },
    //         req.currentUser,
    //         companyId
    //     );

    //     return res.status(HTTP_STATUS.OK).json({
    //         message: 'Get chat list successfully',
    //         pagination: {
    //             totalCount,
    //             currentPage: page,
    //             totalPages
    //         },
    //         data: chat
    //     });
    // }

    // public async getChatForCandidate(req: Request, res: Response) {
    //     const chatRoomId = req.params.chatRoomId;

    //     const chat = await chatservice.getChatForCandidate(req.currentUser, chatRoomId);

    //     return res.status(HTTP_STATUS.OK).json({
    //         message: 'Get chat successfully',
    //         data: chat
    //     });
    // }

    // public async getChatForRECRUITER(req: Request, res: Response) {
    //     const chatRoomId = req.params.chatRoomId;
    //     const companyId = Number(req.params.companyId);

    //     const chat = await chatservice.getChatForRECRUITER(req.currentUser, chatRoomId, companyId);

    //     return res.status(HTTP_STATUS.OK).json({
    //         message: 'Get chat successfully',
    //         data: chat
    //     });
    // }

    public async getChatList(req: Request, res: Response) {
        const companyId = Number(req.query.companyId);
        const lastMessageAt = String(req.query.lastMessageAt);
        const chatId = Number(req.query.chatId);
        const limit = req.query.limit ? Number(req.query.limit) : 20;

        const cursor = lastMessageAt && chatId ? { lastMessageAt, chatId } : undefined;

        const chatList = await chatservice.getChatList(req.currentUser, limit, companyId, cursor);
        // const chatList = await chatservice.getChatList(req.currentUser, companyId, { lastMessageAt, chatId });

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get chat list successfully',
            data: chatList
        });
    }

    public async getMessages(req: Request, res: Response) {
        const limit = req.query.limit ? Number(req.query.limit) : 20;
        const chatId = Number(req.params.chatId);
        const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;

        const messages = await chatservice.getMessages(chatId, limit, cursor);

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get chat messages successfully',
            data: messages
        });
    }

    public async createChat(req: Request, res: Response) {
        const companyId = Number(req.params.companyId);
        const candidateProfileId = Number(req.params.candidateProfileId);

        const messages = await chatservice.createChat(companyId, candidateProfileId);

        return res.status(HTTP_STATUS.CREATED).json({
            message: 'Create chat successfully',
            data: messages
        });
    }
}

export const chatController: ChatController = new ChatController();

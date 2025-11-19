import { Request, Response } from 'express';
import HTTP_STATUS from '~/globals/constants/http.constant';
import { chatservice } from './chat.service';

class ChatController {
    public async getChatListForCandidate(req: Request, res: Response) {
        let { page = 1, limit = 5 } = req.query;

        const { chat, totalCount, totalPages } = await chatservice.getChatListForCandidate(
            {
                page: parseInt(page as string),
                limit: parseInt(limit as string)
            },
            req.currentUser
        );

        console.log('chat data in controller : ', chat)

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get chat list successfully',
            pagination: {
                totalCount,
                currentPage: page,
                totalPages
            },
            data: chat
        });
    }

    public async getChatListForRecruiter(req: Request, res: Response) {
        let { page = 1, limit = 5 } = req.query;
        const companyId = Number(req.params.companyId)

        const { chat, totalCount, totalPages } = await chatservice.getChatListForRecruiter(
            {
                page: parseInt(page as string),
                limit: parseInt(limit as string)
            },
            req.currentUser,
            companyId
        );

        return res.status(HTTP_STATUS.OK).json({
            message: 'Get chat list successfully',
            pagination: {
                totalCount,
                currentPage: page,
                totalPages
            },
            data: chat
        });
    }
}

export const chatController: ChatController = new ChatController();

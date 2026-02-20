import { Role } from '@prisma/client';
import { IJwtVerifyPayload } from '~/features/auth/auth.interface';
import { authService } from '~/features/auth/auth.service';
import { BadRequestException } from '~/globals/cores/error.cores';
import prisma from '~/prisma';

// Chat room join handling
export async function handleJoinChat(socket: any, { token, companyId, candidateProfileId }: any) {
    try {
        if (!token) {
            return socket.emit('error', 'Authentication token required');
        }

        console.log('access token key : ', process.env.ACCESS_TOKEN_SECRET);
        //  verify jwt token on every room join
        const decoded = (await authService.verifyJwtToken(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        )) as IJwtVerifyPayload;
        const { sub, role } = decoded;

        // Save user info for this event
        socket.data.userId = sub;
        socket.data.role = role;

        // let companyId;
        // let candidateProfileId;

        if (role === Role.CANDIDATE) {
            const candidateProfile = await prisma.candidateProfile.findUnique({
                where: {
                    userId: Number(sub)
                }
            });
            if (!candidateProfile)
                throw new BadRequestException('Candidate profile not found, can not join the chat room');

            // const apply = await prisma.apply.findUnique({
            //     where: {
            //         id: applyId,
            //         candidateProfileId: candidateProfile!.id
            //     }
            // });

            const apply = await prisma.apply.findFirst({
                where: { candidateProfileId: candidateProfile.id, companyId }
            });

            if (!apply) throw new BadRequestException('Error while connecting the chat room');

            companyId = apply.companyId;
            candidateProfileId = candidateProfile.id;

            socket.data.companyId = companyId;
            socket.data.candidateProfileId = candidateProfileId;

            console.log('candidate connect');
        } else {
            if (role === Role.RECRUITER) {
                // const apply = await prisma.apply.findUnique({
                //     where: { id: applyId }
                // });

                // if (!apply) throw new BadRequestException('Invalid applyId can not connect to the chat room');

                // const isVerifyJob = await prisma.job.findUnique({
                //     where: { postById: Number(sub), id: apply.jobId }
                // });

                // if (!isVerifyJob) throw new BadRequestException('Invalid jobId, can not connect to the chat room');

                //---------------------------------------------
                const compay = await prisma.company.findUnique({
                    where: { userId: Number(sub), id: companyId }
                });

                if (!compay) throw new BadRequestException('Invalid companyId, can not connect to the chat room');

                const apply = await prisma.apply.findFirst({
                    where: { candidateProfileId: candidateProfileId, companyId }
                });

                if (!apply) throw new BadRequestException('Invalid request can not connect to the chat room');

                companyId = compay.id;
                candidateProfileId = candidateProfileId;

                socket.data.companyId = companyId;
                socket.data.candidateProfileId = candidateProfileId;

                console.log('recruiter connect');
                console.log(`connect : chat_${companyId}_${candidateProfileId}`);
            }
        }

        socket.rooms.forEach((room: any) => {
            if (room !== socket.id && room.startsWith('chat_')) {
                socket.leave(room);
                console.log(`Auto leaving previous chat room: ${room}`);
            }
        });

        const chatRoomId = `chat_${companyId}_${candidateProfileId}`;
        socket.join(chatRoomId);
    } catch (error) {
        // throw new BadRequestException(`error while joining the room \n ${error}`);
        console.error(`error while joining the room \n ${error}`);
    }
}

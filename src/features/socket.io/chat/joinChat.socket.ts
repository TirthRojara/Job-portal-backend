import { Role } from '@prisma/client';
import { IJwtVerifyPayload } from '~/features/auth/auth.interface';
import { authService } from '~/features/auth/auth.service';
import { BadRequestException } from '~/globals/cores/error.cores';
import prisma from '~/prisma';

// Chat room join handling
export async function handleJoinChat(socket: any, { token, applyId }: any) {
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

        let companyId;
        let candidateProfileId;

        if (role === Role.CANDIDATE) {
            const candidateProfile = await prisma.candidateProfile.findUnique({
                where: {
                    userId: Number(sub)
                }
            });
            if (!candidateProfile)
                throw new BadRequestException('Candidate profile not found, can not join the chat room');

            const apply = await prisma.apply.findUnique({
                where: {
                    id: applyId,
                    candidateProfileId: candidateProfile!.id
                }
            });

            if (!apply) throw new BadRequestException('Error while connecting the chat room');

            companyId = apply.companyId;
            candidateProfileId = candidateProfile.id;

            socket.data.companyId = companyId;
            socket.data.candidateProfileId = candidateProfileId;
        } else {
            if (role === Role.RECRUITER) {
                const apply = await prisma.apply.findUnique({
                    where: { id: applyId }
                });

                if (!apply) throw new BadRequestException('Invalid applyId can not connect to the chat room');

                const isVerifyJob = await prisma.job.findUnique({
                    where: { postById: Number(sub), id: apply.jobId }
                });

                if (!isVerifyJob) throw new BadRequestException('Invalid jobId, can not connect to the chat room');

                companyId = isVerifyJob.companyId;
                candidateProfileId = apply.candidateProfileId;

                socket.data.companyId = companyId;
                socket.data.candidateProfileId = candidateProfileId;
            }
        }

        const chatRoomId = `chat_${companyId}_${candidateProfileId}`;
        socket.join(chatRoomId);
    } catch (error) {
        throw new BadRequestException(`error while joining the room \n ${error}`);
    }
}

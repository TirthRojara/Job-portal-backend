import prisma from '~/prisma';
import { candidateProfileService } from '../candidate-profile/candidate-profile.service';
import { CandidateEducation, Education } from '@prisma/client';
import { NotFountException } from '~/globals/cores/error.cores';
import { ICandidateEducationCreate, ICandidateEducationUpdate } from './candidate-education.interface';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

class CandidateEducationService {
    private async findEducation(educationId: number): Promise<Education> {
        const education = await prisma.education.findUnique({
            where: { id: educationId }
        });

        if (!education) throw new NotFountException(`Education with ID ${educationId} not found`);

        return education;
    }

    public async create(requestBody: ICandidateEducationCreate, currentUser: UserPayLoad) {
        const { ...rest } = requestBody;

        await this.findEducation(requestBody.educationId);

        const candidateProfile = await candidateProfileService.readOne(currentUser.id);

        const candidateEducation = await prisma.candidateEducation.create({
            data: {
                ...rest,
                candidateProfileId: candidateProfile.id
            }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_EDUCATION(currentUser.id));

        return candidateEducation;
    }

    public async readAll(): Promise<CandidateEducation[]> {
        const candidateEducation = await prisma.candidateEducation.findMany();
        return candidateEducation;
    }

    // public async readMyEducation(currentUser: UserPayLoad): Promise<CandidateEducation[]> {
    //   const candidateProfile = await candidateProfileService.readOne(currentUser.id);

    //   const candidateEducation = await prisma.candidateEducation.findMany({
    //     where: {
    //       candidateProfileId: candidateProfile.id
    //     }
    //   });

    //   if (candidateEducation.length === 0) {
    //     // Option 1: Throw error
    //     throw new NotFountException(`No education records found for candidate with User ID: ${currentUser.id}`);

    //     // Option 2: Return null or custom object instead of empty array
    //     // return null;
    //   }

    //   return candidateEducation;
    // }

    public async readMyEducation(currentUser: UserPayLoad): Promise<CandidateEducation[]> {
        const cacheData = await redisClient.get(RedisKey.USER.CANDIDATE_EDUCATION(currentUser.id));
        if (cacheData) return JSON.parse(cacheData) as CandidateEducation[];

        const candidateProfileWithEducation = await prisma.candidateProfile.findUnique({
            where: { userId: currentUser.id },
            include: {
                CandidateEducation: true // Include related education records
            }
        });

        if (!candidateProfileWithEducation) {
            throw new NotFountException(`Candidate profile with User ID: ${currentUser.id} not found`);
        }

        if (candidateProfileWithEducation.CandidateEducation.length === 0) {
            // Option 1: Throw error
            throw new NotFountException(`No education records found for candidate with User ID: ${currentUser.id}`);

            // Option 2: Return null or custom object instead of empty array
            // return null;
        }

        redisClient
            .set(
                RedisKey.USER.CANDIDATE_EDUCATION(currentUser.id),
                JSON.stringify(candidateProfileWithEducation.CandidateEducation),
                'EX',
                86400
            )
            .catch((err) => console.error('Redis cache error:', err));

        return candidateProfileWithEducation.CandidateEducation;
    }

    public async update(
        id: number,
        requestBody: ICandidateEducationUpdate,
        currentUser: UserPayLoad
    ): Promise<CandidateEducation> {
        const { educationId, ...rest } = requestBody;

        if (educationId) {
            await this.findEducation(requestBody.educationId);
        }

        const candidateProfile = await candidateProfileService.readOne(currentUser.id);

        const candidateEducation = await prisma.candidateEducation.update({
            where: {
                id,
                candidateProfileId: candidateProfile.id
            },
            data: {
                educationId,
                ...rest
            }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_EDUCATION(currentUser.id));

        return candidateEducation;
    }

    public async remove(id: number, currentUser: UserPayLoad): Promise<void> {
        const candidateProfile = await candidateProfileService.readOne(currentUser.id);
        await prisma.candidateEducation.delete({
            where: { id, candidateProfileId: candidateProfile.id }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_EDUCATION(currentUser.id));
    }
}

export const candidateEducationService: CandidateEducationService = new CandidateEducationService();

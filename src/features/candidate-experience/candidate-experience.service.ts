import prisma from '~/prisma';
import { candidateProfileService } from '../candidate-profile/candidate-profile.service';
import { ICandidateExperience } from './candidate-experience.interface';
import { CandidateExperience } from '@prisma/client';
import { NotFountException } from '~/globals/cores/error.cores';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

class CandidateExperienceService {
    public async create(requestBody: ICandidateExperience, userId: number): Promise<CandidateExperience> {
        const { startDate, endDate, ...rest } = requestBody;

        const candidateProfile = await candidateProfileService.readOne(userId);

        const candidateExperience = await prisma.candidateExperience.create({
            data: {
                ...rest,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : undefined,
                candidateProfileId: candidateProfile.id
            }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_EXPERIENCE(userId))

        return candidateExperience;
    }

    public async readAll(): Promise<CandidateExperience[]> {
        const candidateExperience = await prisma.candidateExperience.findMany();

        return candidateExperience;
    }

    public async readMyExperience(userId: number): Promise<CandidateExperience[]> {
        const cacheData =await redisClient.get(RedisKey.USER.CANDIDATE_EXPERIENCE(userId));
        if (cacheData) return JSON.parse(cacheData) as CandidateExperience[];

        const candidateProfile = await candidateProfileService.readOne(userId);

        const candidateExperience = await prisma.candidateExperience.findMany({
            where: {
                candidateProfileId: candidateProfile.id
            }
        });

        if (!candidateExperience || candidateExperience.length === 0)
            throw new NotFountException(`No experience records found for candidate with User ID: ${userId}`);

        redisClient.set(RedisKey.USER.CANDIDATE_EXPERIENCE(userId), JSON.stringify(candidateExperience), 'EX', 7200);

        return candidateExperience;
    }

    public async findOne(id: number, userId: number): Promise<CandidateExperience> {
        const candidateProfile = await candidateProfileService.readOne(userId);

        const candidateExperience = await prisma.candidateExperience.findUnique({
            where: { id, candidateProfileId: candidateProfile.id }
        });

        if (!candidateExperience)
            throw new NotFountException(`No experience records found for candidate with cadidateExperience ID: ${id}`);

        return candidateExperience;
    }

    public async update(requestBody: ICandidateExperience, id: number, userId: number): Promise<CandidateExperience> {
        const { startDate, endDate, currentlyWorking, ...rest } = requestBody;

        const findCadidateExperience = await this.findOne(id, userId);

        const candidateExperience = await prisma.candidateExperience.update({
            where: { id, candidateProfileId: findCadidateExperience.candidateProfileId },
            data: {
                ...rest,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : null,
                currentlyWorking: endDate ? false : currentlyWorking
            }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_EXPERIENCE(userId))

        return candidateExperience;
    }

    public async remove(id: number, userId: number): Promise<void> {
        const findCadidateExperience = await this.findOne(id, userId);

        await prisma.candidateExperience.delete({
            where: { id_candidateProfileId: { id, candidateProfileId: findCadidateExperience.candidateProfileId } }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_EXPERIENCE(userId))
    }
}

export const candidateExperienceService: CandidateExperienceService = new CandidateExperienceService();

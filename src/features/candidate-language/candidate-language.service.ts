import { CandidateLanguage, CandidateProfile, Level } from '@prisma/client';
import { candidateProfileService } from '../candidate-profile/candidate-profile.service';
import prisma from '~/prisma';
import { ICandidateLanguageCreate } from './candidate-language.interface';
import { ForbiddenException, NotFountException } from '~/globals/cores/error.cores';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

class CandidateLanguageService {
    public async create(
        requestBody: ICandidateLanguageCreate,
        currentUser: UserPayLoad
    ): Promise<Omit<CandidateLanguage, 'candidateProfileId'>> {
        const { languageName, level } = requestBody;

        const candidateProfile: CandidateProfile = await candidateProfileService.readOne(currentUser.id);

        const candidateLanguage = await prisma.candidateLanguage.create({
            data: {
                candidateProfileId: candidateProfile.id,
                languageName,
                level
            },
            omit: { candidateProfileId: true }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_LANGUAGE(currentUser.id));

        return candidateLanguage;
    }

    public async readAll() {
        const candidateLanguage: CandidateLanguage[] = await prisma.candidateLanguage.findMany();
        return candidateLanguage;
    }

    public async readMyLanguage(currentUser: UserPayLoad): Promise<Omit<CandidateLanguage, 'candidateProfileId'>[]> {
        const cacheData = await redisClient.get(RedisKey.USER.CANDIDATE_LANGUAGE(currentUser.id));
        if (cacheData) return JSON.parse(cacheData);

        const candidateProfile: CandidateProfile = await candidateProfileService.readOne(currentUser.id);

        const candidateLanguage = await prisma.candidateLanguage.findMany({
            where: { candidateProfileId: candidateProfile.id },
            omit: { candidateProfileId: true }
        });

        if (!candidateLanguage || candidateLanguage.length === 0)
            throw new NotFountException(`No language records found for candidate with User ID: ${currentUser.id}`);

        redisClient.set(
            RedisKey.USER.CANDIDATE_LANGUAGE(currentUser.id),
            JSON.stringify(candidateLanguage),
            'EX',
            7200
        );

        return candidateLanguage;
    }

    public async readLanguageById(candidateProfileId: number, jobId: number) {
        const apply = await prisma.apply.findFirst({
            where: { jobId, candidateProfileId }
        });

        if (!apply) throw new ForbiddenException(`You don't have access.`);

        const candidateLanguage = await prisma.candidateLanguage.findMany({
            where: { candidateProfileId },
            omit: { candidateProfileId: true }
        });

        if (!candidateLanguage || candidateLanguage.length === 0)
            throw new NotFountException(`No language records found for candidate`);

        return candidateLanguage;
    }

    public async updateLevel(
        currentUser: UserPayLoad,
        languageName: string,
        level: Level
    ): Promise<Omit<CandidateLanguage, 'candidateProfileId'>> {
        const candidateProfile: CandidateProfile = await candidateProfileService.readOne(currentUser.id);

        const candidateLanguage = await prisma.candidateLanguage.update({
            where: {
                candidateProfileId_languageName: {
                    candidateProfileId: candidateProfile.id,
                    languageName
                }
            },
            data: { level },
            omit: { candidateProfileId: true }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_LANGUAGE(currentUser.id));

        return candidateLanguage;
    }

    public async remove(currentUser: UserPayLoad, languageName: string): Promise<void> {
        const candidateProfile: CandidateProfile = await candidateProfileService.readOne(currentUser.id);

        const candidateLanguage = await prisma.candidateLanguage.delete({
            where: {
                candidateProfileId_languageName: {
                    candidateProfileId: candidateProfile.id,
                    languageName
                }
            }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_LANGUAGE(currentUser.id));
    }
}

export const candidateLanguageService: CandidateLanguageService = new CandidateLanguageService();

import { CandidateProfile, Role } from '@prisma/client';
import { BadRequestException, NotFountException } from '~/globals/cores/error.cores';
import prisma from '~/prisma';
import { ICandidateProfile } from './candidate-profile.interface';
import { deleteCV } from '~/globals/helpers/upload.helper';
import path from 'path';
import fs from 'fs/promises';
import { error } from 'console';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

class CandidateProfileService {
    public async create(
        requestBody: ICandidateProfile,
        currentUser: UserPayLoad,
        file: Express.Multer.File[]
    ): Promise<CandidateProfile> {
        // const { fullName, gender, phone, cv, birthDate, address } = requestBody;
        const { birthDate, openToWork, ...rest } = requestBody;

        const cvURL = file[0].filename;

        const candidateProfile = await prisma.candidateProfile.create({
            data: {
                ...rest,
                cv: cvURL,
                birthDate: new Date(birthDate),
                userId: currentUser.id,
                openToWork: Boolean(openToWork)
            }
        });

        return candidateProfile;
    }

    public async readAll(): Promise<CandidateProfile[]> {
        const candidates: CandidateProfile[] = await prisma.candidateProfile.findMany();

        return candidates;
    }

    public async readOne(id: number): Promise<CandidateProfile> {
        const cacheData = await redisClient.get(RedisKey.USER.CANDIDATE.PROFILE(id));
        if (cacheData) return JSON.parse(cacheData);

        const candidate: CandidateProfile | null = await prisma.candidateProfile.findUnique({
            where: { userId: id }
        });

        if (!candidate) throw new NotFountException(`Candidate profile with User ID: ${id} not found`);

        redisClient.set(RedisKey.USER.CANDIDATE.PROFILE(id), JSON.stringify(candidate), 'EX', 7200);

        return candidate;
    }

    public async readById(id: number): Promise<CandidateProfile> {
        const cacheData = await redisClient.get(RedisKey.USER.CANDIDATE.PROFILE(id));
        if (cacheData) return JSON.parse(cacheData);

        const candidate: CandidateProfile | null = await prisma.candidateProfile.findUnique({
            where: { id }
        });

        if (!candidate) throw new NotFountException(`Candidate profile with User ID: ${id} not found`);

        redisClient.set(RedisKey.USER.CANDIDATE.PROFILE(id), JSON.stringify(candidate), 'EX', 7200);

        return candidate;
    }

    public async update(
        id: number,
        requestBody: ICandidateProfile,
        file: Express.Multer.File[]
    ): Promise<CandidateProfile> {
        // const { fullName, gender, phone, cv, birthDate, address, openToWork } = requestBody;
        const { birthDate, ...rest } = requestBody;

        // const cvURL = file[0].filename;
        const cvURL = file && file.length > 0 ? file[0].filename : undefined;

        await this.readOne(id);

        if (cvURL) {
            const oldCV = await prisma.candidateProfile.findUnique({
                where: { userId: id },
                select: { cv: true }
            });

            const profileUpdate = await prisma.candidateProfile.update({
                where: { userId: id },
                data: {
                    ...rest,
                    birthDate: birthDate ? new Date(birthDate) : undefined,
                    cv: cvURL
                }
            });

            if (oldCV) {
                deleteCV(oldCV.cv);
            }

            await redisClient.del(RedisKey.USER.CANDIDATE.RESUME(id))
            await redisClient.del(RedisKey.USER.CANDIDATE.PROFILE(id));

            return profileUpdate;
        } else {
            const profileUpdate = await prisma.candidateProfile.update({
                where: { userId: id },
                data: {
                    ...rest,
                    birthDate: birthDate ? new Date(birthDate) : undefined
                }
            });

            await redisClient.del(RedisKey.USER.CANDIDATE.PROFILE(id));

            return profileUpdate;
        }
    }

    // public async remove(id: number): Promise<void> {
    //     await this.readOne(id);
    //     await prisma.candidateProfile.delete({
    //         where: { userId: id }
    //     });

    //     await redisClient.del(RedisKey.USER.CANDIDATE.PROFILE(id));
    // }

    public async getResume(candidateId: number): Promise<string> {
        const candidate = await prisma.candidateProfile.findUnique({
            where: { id: candidateId },
            select: { cv: true }
        });

        if (!candidate) throw new BadRequestException('Candidate does not have resume');

        const resumePath = path.join(__dirname, '../../../uploads/candidate-cv', `${candidate.cv}`);

        try {
            await fs.access(resumePath, fs.constants.F_OK);
            return resumePath;
        } catch (error) {
            throw new BadRequestException(`Resume not found, ${error}`);
        }
    }

    public async viewResumeForCandidate(currentUser: UserPayLoad): Promise<string> {
        const cacheData = await redisClient.get(RedisKey.USER.CANDIDATE.RESUME(currentUser.id));
        if (cacheData) return cacheData;

        const candidate = await prisma.candidateProfile.findUnique({
            where: { userId: currentUser.id },
            select: { id: true }
        });

        if (!candidate) throw new BadRequestException('Invalid request');

        const resumePath = await this.getResume(candidate.id);

        redisClient.set(RedisKey.USER.CANDIDATE.RESUME(currentUser.id), resumePath, 'EX', 7200);
        
        return resumePath;
    }

    public async viewResumeForRecruiter(currentUser: UserPayLoad, candidateId: number, companyId: number) {
        const cacheData = await redisClient.get(RedisKey.USER.CANDIDATE.RESUME(candidateId));
        if (cacheData) return cacheData;

        const company = await prisma.company.findUnique({
            where: { id: companyId, userId: currentUser.id },
            select: { id: true }
        });
        if (!company) throw new BadRequestException('Invalid request');

        const isRecruiterHasAccess = await prisma.apply.findFirst({
            where: { candidateProfileId: candidateId, companyId: company.id }
        });

        if (!isRecruiterHasAccess) throw new BadRequestException('Invalid request');

        const resumePath = await this.getResume(candidateId);

        redisClient.set(RedisKey.USER.CANDIDATE.RESUME(candidateId), resumePath, 'EX', 7200);
        
        return resumePath;
    }
}

export const candidateProfileService: CandidateProfileService = new CandidateProfileService();

import { CandidateProfile, Role } from '@prisma/client';
import { BadRequestException, ForbiddenException, NotFountException } from '~/globals/cores/error.cores';
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

        // const cvURL = file[0].filename || undefined;

        const isExitsProfile = await prisma.candidateProfile.findUnique({
            where: { userId: currentUser.id },
            select: { id: true }
        });

        if (isExitsProfile) {
            throw new BadRequestException('Alreay profile created.');
        }

        const candidateProfile = await prisma.candidateProfile.create({
            data: {
                ...rest,
                // cv: cvURL,
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

        const candidate = await prisma.candidateProfile.findUnique({
            where: { userId: id }
        });

        if (!candidate) throw new NotFountException(`Candidate profile with User ID: ${id} not found`);

        redisClient.set(RedisKey.USER.CANDIDATE.PROFILE(id), JSON.stringify(candidate), 'EX', 7200);

        return candidate;
    }

    public async readById(id: number): Promise<CandidateProfile> {
        const cacheData = await redisClient.get(RedisKey.USER.CANDIDATE.PROFILE(id));
        if (cacheData) return JSON.parse(cacheData);

        const candidate = await prisma.candidateProfile.findUnique({
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

            if (oldCV?.cv) {
                deleteCV(oldCV.cv);
            }

            await redisClient.del(RedisKey.USER.CANDIDATE.RESUME(id));
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

        if (!candidate.cv) throw new NotFountException('Candidate does not have resume');

        const resumePath = path.join(__dirname, '../../../uploads/candidate-cv', `${candidate.cv}`);

        try {
            await fs.access(resumePath, fs.constants.F_OK);
            return resumePath;
        } catch (error) {
            throw new BadRequestException(`Resume not found`);
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

    public async viewResumeForRecruiter(currentUser: UserPayLoad, candidateProfileId: number, jobId: number) {
        const cacheData = await redisClient.get(RedisKey.USER.CANDIDATE.RESUME(candidateProfileId));
        if (cacheData) return cacheData;

        // const company = await prisma.company.findUnique({
        //     where: { id: companyId, userId: currentUser.id },
        //     select: { id: true }
        // });
        // if (!company) throw new BadRequestException('Invalid request');

        // const isRecruiterHasAccess = await prisma.apply.findFirst({
        //     where: { candidateProfileId: candidateId, companyId: company.id }
        // });

        // if (!isRecruiterHasAccess) throw new BadRequestException('Invalid request');

        const apply = await prisma.apply.findFirst({
            where: { jobId, candidateProfileId }
        });

        if (!apply) throw new ForbiddenException(`You don't have access.`);

        const resumePath = await this.getResume(candidateProfileId);

        redisClient.set(RedisKey.USER.CANDIDATE.RESUME(candidateProfileId), resumePath, 'EX', 7200);

        return resumePath;
    }

    public async getStates(currentUser: UserPayLoad) {
        const candidate = await prisma.candidateProfile.findUnique({
            where: { userId: currentUser.id },
            select: { id: true }
        });

        if (!candidate) {
            throw new BadRequestException('Candidate profile not found.');
        }

        const totalApplication = await prisma.apply.count({
            where: { candidateProfileId: candidate.id }
        });

        const savedJob = await prisma.saveJob.count({
            where: { candidateProfileId: candidate.id }
        });

        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const todayApply = await prisma.apply.count({
            where: {
                candidateProfileId: candidate.id,
                applyDate: {
                    gte: startOfToday,
                    lte: endOfToday
                }
            }
        });

        const now = new Date();

        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);

        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfNextWeek = new Date(startOfWeek);
        startOfNextWeek.setDate(startOfWeek.getDate() + 7);

        const weeklyApply = await prisma.apply.count({
            where: {
                candidateProfileId: candidate.id,
                applyDate: {
                    gte: startOfWeek,
                    lt: startOfNextWeek
                }
            }
        });

        return { totalApplication, savedJob, todayApply, weeklyApply };
    }
}

export const candidateProfileService: CandidateProfileService = new CandidateProfileService();

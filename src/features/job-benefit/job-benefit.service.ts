import prisma from '~/prisma';
import { jobService } from '../job/job.service';
import { JobBenefit } from '@prisma/client';
import { BadRequestException, NotFountException } from '~/globals/cores/error.cores';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

class JobBenefitService {
    public async getAllBenefitList() {
        const cacheData = await redisClient.get(RedisKey.JOB_BENEFIT);
        if (cacheData) return JSON.parse(cacheData);

        const benefit = await prisma.benefit.findMany();

        redisClient.set(RedisKey.JOB_BENEFIT, JSON.stringify(benefit), 'EX', 86400);

        return benefit;
    }

    public async findBenefit(benefitName: string) {
        const benefit = await prisma.benefit.findUnique({
            where: {
                name: benefitName
            }
        });

        if (!benefit) throw new NotFountException(`${benefitName} does not exist`);

        return benefit;
    }

    public async create(jobId: number, benefitName: string, currentUser: UserPayLoad): Promise<JobBenefit> {
        await jobService.findJobByUser(jobId, currentUser.id);
        await this.findBenefit(benefitName);

        try {
            const jobBenefit = await prisma.jobBenefit.create({
                data: {
                    jobId,
                    benefitName
                }
            });

            await redisClient.del(RedisKey.JOB.BENEFIT(jobId));

            return jobBenefit;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new BadRequestException('This benefit already exists');
            }
            throw error; // rethrow other errors
        }
    }

    public async read(jobId: number): Promise<{ jobId: number; benefitNames: string[] }> {
        const cacheData = await redisClient.get(RedisKey.JOB.BENEFIT(jobId));
        if (cacheData) return JSON.parse(cacheData);

        const jobBenefit = await prisma.jobBenefit.findMany({
            where: {
                jobId
            }
        });

        const benefitNames = jobBenefit.map((b) => b.benefitName);

        redisClient.set(RedisKey.JOB.BENEFIT(jobId), JSON.stringify({ jobId, benefitNames }), 'EX', 43200);

        return {
            jobId,
            benefitNames
        };
    }

    private async findOne(jobId: number, benefitName: string): Promise<JobBenefit> {
        const jobBenefit = await prisma.jobBenefit.findUnique({
            where: {
                jobId_benefitName: {
                    jobId,
                    benefitName
                }
            }
        });

        if (!jobBenefit) throw new NotFountException(`${benefitName} does not exist in job id: ${jobId}`);

        return jobBenefit;
    }

    public async remove(jobId: number, benefitName: string, currentUser: UserPayLoad): Promise<void> {
        await jobService.findJobByUser(jobId, currentUser.id);
        await this.findBenefit(benefitName);
        // await this.findOne(jobId, benefitName);

        try {
            await prisma.jobBenefit.delete({
                where: {
                    jobId_benefitName: {
                        jobId,
                        benefitName
                    }
                }
            });

            await redisClient.del(RedisKey.JOB.BENEFIT(jobId));
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFountException(`${benefitName} does not exist in job id: ${jobId}`);
            }
            throw error;
        }
    }
}

export const jobBenefitService: JobBenefitService = new JobBenefitService();

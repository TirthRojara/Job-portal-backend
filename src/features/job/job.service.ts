import prisma from '~/prisma';
import { companyService } from '../company/company.service';
import { IJob } from './job.interface';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import { Job, JobStatus, WorkPlace } from '@prisma/client';
import { CustomError, ForbiddenException, NotFountException } from '~/globals/cores/error.cores';
import { jobRoleService } from '../job-role/job-role.service';
import { PassThrough } from 'stream';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';
import chalk from 'chalk';
import { jobRedis } from './job.redis';
import { log } from '~/globals/helpers/log.helper';

class JobService {
    public async create(
        requestBody: IJob,
        currentUser: UserPayLoad,
        recruiterPackage: RecruiterPackagePayload,
        companyId: number
    ) {
        const { applicationDeadline, jobRoleId, ...rest } = requestBody;

        await companyService.findOne(companyId, currentUser.id);
        await jobRoleService.findOne(jobRoleId);

        // get active package of the recruiter`

        // count how many job post by recruiter
        let checkLimit = await prisma.checkLimitForRecruiter.findUnique({
            where: { recruiterId: currentUser.id }
        });

        if (!checkLimit) {
            checkLimit = await prisma.checkLimitForRecruiter.create({
                data: {
                    recruiterId: currentUser.id,
                    jobCount: 0
                }
            });
        }

        if (checkLimit.jobCount >= recruiterPackage.package.jobPostLimit) {
            throw new ForbiddenException(`You have reached your job post limit. Please upgrade your package.`);
        }

        const job = await prisma.job.create({
            data: {
                ...rest,
                applicationDeadline: new Date(applicationDeadline),
                jobRoleId,
                companyId,
                postById: currentUser.id
            }
        });

        await prisma.checkLimitForRecruiter.update({
            where: { recruiterId: currentUser.id },
            data: { jobCount: { increment: 1 } }
        });

        // here you should not delete the key insteed you should get the key and update the value
        await redisClient.del(RedisKey.JOB.ME(currentUser.id));

        return job;
    }

    public async readAll({
        page,
        limit,
        filter,
        salaryMin,
        // JobStatus
        location,
        workplace
    }: {
        page: number;
        limit: number;
        filter: string;
        salaryMin: number;
        // JobStatus: string | null;
        location?: string;
        workplace?: WorkPlace;
    }) {
        const additionConditionQuery: any = {
            salaryMin: { gte: salaryMin },
            isDeleted: false,
            status: 'ACTIVE'
            // location,
            // workplace
        };

        if (location && location.trim() !== '') {
            additionConditionQuery.location = {
                contains: location,
                mode: 'insensitive'
            };
        }

        if (workplace) {
            additionConditionQuery.workplace = workplace;
        }

        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter,
            filterFields: ['title', 'description', 'responsibilities', 'requirements', 'location'],
            entity: 'job',
            // additionCondition: { salaryMin: { gte: salaryMin }, isDeleted: false, status: JobStatus },
            additionCondition: additionConditionQuery,
            orderCondition: { postedAt: 'desc' },
            omit: { postById: true, isDeleted: true, jobRoleId: true, companyId: true },
            include: { jobRole: true, company: { select: { id: true, name: true } } }
        });

        return { job: data, totalCount, totalPages };
    }

    public async readAllForRecruiter(
        {
            page,
            limit,
            filter,
            salaryMin,
            location,
            workplace
        }: {
            page: number;
            limit: number;
            filter: string;
            salaryMin: number;
            location?: string;
            workplace?: WorkPlace;
        },
        currentUser: UserPayLoad
    ) {
        // const cacheData = await redisClient.get(RedisKey.JOB.ME(currentUser.id));
        // if (cacheData) return JSON.parse(cacheData);

        const additionConditionQuery: any = {
            salaryMin: { gte: salaryMin },
            postById: currentUser.id
        };

        if (location && location.trim() !== '') {
            additionConditionQuery.location = {
                contains: location,
                mode: 'insensitive'
            };
        }

        if (workplace) {
            additionConditionQuery.workplace = workplace;
        }

        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter,
            filterFields: ['title', 'description', 'responsibilities', 'requirements', 'location'],
            entity: 'job',
            additionCondition: additionConditionQuery,
            orderCondition: { postedAt: 'desc' },
            omit: { isDeleted: true, jobRoleId: true, companyId: true },
            include: { jobRole: true, company: { select: { id: true, name: true } } }
        });

        // redisClient
        //     .set(RedisKey.JOB.ME(currentUser.id), JSON.stringify({ job: data, totalCount, totalPages }), 'EX', 43200)
        //     .catch((err) => console.error('Redis set failed', err));

        return { job: data, totalCount, totalPages };
    }

    // private serializeData(data: any) {
    //   return {
    //     ...data,
    //     companyName: data?.company?.name,
    //     postByName: data?.postBy?.name,
    //     company: undefined,
    //     postBy: undefined
    //   };
    // }

    // public async readOne(id: number): Promise<Job> {
    //   const job = await prisma.job.findUnique({
    //     where: { id },
    //     include: {
    //       company: true,
    //       postBy: true,
    //       jobRole: true
    //     }
    //   });

    //   if (!job) throw new NotFountException(`Cannot find job: ${id}`);

    //   const dataConfig = {
    //     company: [
    //       { newKey: 'companyName', property: 'name' },
    //       { newKey: 'companyWebsiteUrl', property: 'websiteUrl' }
    //     ],
    //     postBy: [{ newKey: 'postByName', property: 'name' }],
    //     jobRole: [{ newKey: 'jobRoleName', property: 'name' }]
    //   };

    //   return serializeData(job, dataConfig);
    // }

    public async readOne(id: number, currentUser: UserPayLoad): Promise<Omit<Job, 'totalview'>> {
        // incr views
        jobRedis.INCR_views(currentUser.id, id);

        const cacheData = await redisClient.get(RedisKey.JOB.ID(id));
        if (cacheData) return JSON.parse(cacheData);

        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                company: { select: { name: true } },
                postBy: { select: { name: true } },
                jobRole: { select: { name: true } }
            },
            omit: { totalview: true }
        });

        if (!job) throw new NotFountException(`Can't find job with id: ${id}`);

        redisClient
            .set(RedisKey.JOB.ID(id), JSON.stringify(job), 'EX', 43200)
            .catch((err) => console.error('Redis set failed', err));

        return job;
    }

    // private method
    public async findOne(id: number, companyId: number, userId: number): Promise<Job> {
        const job = await prisma.job.findFirst({
            where: { id, companyId, postById: userId }
        });

        if (!job) throw new NotFountException(`Can't find company with id: ${companyId} for user: ${userId}`);

        return job;
    }

    public async findJobByUser(id: number, userId: number): Promise<Job> {
        const job = await prisma.job.findFirst({
            where: { id, postById: userId }
        });

        if (!job) throw new NotFountException(`Can't find job with id: ${id} for user: ${userId}`);

        return job;
    }

    public async update(id: number, companyId: number, currentUser: UserPayLoad, requestBody: IJob): Promise<Job> {
        const { applicationDeadline, ...rest } = requestBody;

        await this.findOne(id, companyId, currentUser.id);

        if (requestBody.jobRoleId !== undefined && requestBody.jobRoleId !== null) {
            await jobRoleService.findOne(requestBody.jobRoleId);
        }

        const job = await prisma.job.update({
            where: { id, companyId, postById: currentUser.id },
            data: {
                ...rest,
                applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined
            }
        });

        await redisClient.del(RedisKey.JOB.ME(currentUser.id));

        // here also update the key
        await redisClient.del(RedisKey.JOB.ID(job.id));

        return job;
    }

    public async updateStatus(
        id: number,
        companyId: number,
        currentUser: UserPayLoad,
        status: JobStatus
    ): Promise<Job> {
        await this.findOne(id, companyId, currentUser.id);

        const job = await prisma.job.update({
            where: { id, companyId, postById: currentUser.id },
            data: {
                status
            }
        });

        await redisClient.del(RedisKey.JOB.ME(currentUser.id));
        await redisClient.del(RedisKey.JOB.ID(job.id));

        return job;
    }

    public async remove(id: number, companyId: number, currentUser: UserPayLoad): Promise<void> {
        await this.findOne(id, companyId, currentUser.id);

        await prisma.job.update({
            where: { id, companyId, postById: currentUser.id },
            data: {
                isDeleted: true
            }
        });

        await redisClient.del(RedisKey.JOB.ME(currentUser.id));
        await redisClient.del(RedisKey.JOB.ID(id));
    }

    public async findOneActive(jobId: number) {
        const job = await prisma.job.findFirst({
            where: {
                id: jobId,
                status: 'ACTIVE',
                isDeleted: false
            }
        });

        if (!job) throw new NotFountException(`This job is no longer active or exist`);

        return job;
    }

    public async getJobView(jobId: number, currentUser: UserPayLoad) {
        const redisCount = await redisClient.get(RedisKey.JOB.VIEWS_COUNT(jobId));

        const dbCount = await prisma.job.findUnique({
            where: { id: jobId },
            select: { id: true, totalview: true }
        });

        if (!dbCount) throw new NotFountException(`Can't find job with id: ${jobId}`);

        const totalCount = Number(redisCount) + dbCount!.totalview!;

        return { jobId: dbCount.id, totalViews: totalCount };
    }

    public async syncViewInDB() {
        // 1. Distributed lock (prevents duplicate runs across PM2/Docker instances)
        const lockKey = 'lock:cron:job:views-sync';
        const lockAcquired = await redisClient.set(lockKey, '1', 'EX', 240, 'NX'); // 4min TTL
        if (!lockAcquired) {
            console.log('Cron skipped job view - another instance running');
            return;
        }

        const keys: string[] = [];
        let cursor = '0';

        try {
            // 2. SCAN all keys (non-blocking)

            do {
                const [nextCursor, elements] = await redisClient.scan(
                    cursor,
                    'MATCH',
                    'job:*:views:count',
                    'COUNT',
                    '100'
                );

                cursor = nextCursor;
                keys.push(...elements);
            } while (cursor !== '0');

            if (keys.length === 0) return;

            console.log(`Found ${keys.length} job to sync`);

            // 3. Build batch updates
            const updates: any[] = [];
            for (const key of keys) {
                const jobId = key.split(':')[1];
                const count = Number((await redisClient.get(key)) || '0');

                if (count > 0) {
                    updates.push(
                        prisma.job.update({
                            where: { id: Number(jobId) },
                            data: { totalview: { increment: count } }
                        })
                    );
                }
            }

            if (updates.length === 0) return;

            // 4. Atomic DB update FIRST
            await prisma.$transaction(updates);
            console.log(`✅ Synced ${updates.length} job to DB`);

            // 5. Pipeline DEL keys ONLY AFTER DB success
            const pipeline = redisClient.multi();
            keys.forEach((key) => pipeline.del(key));
            await pipeline.exec();
            console.log(`🗑️  Deleted ${keys.length} Redis keys`);
        } catch (error) {
            console.error(`❌ Cron sync failed: ${error}`);
            // Keys REMAIN → next cron retries! ✅
        } finally {
            // 6. Always release lock
            await redisClient.del(lockKey);
            console.log('lock relese: syncViewInDb for job');
        }
    }
}

export const jobService: JobService = new JobService();

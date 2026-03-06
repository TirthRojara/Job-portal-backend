import prisma from '~/prisma';
import { candidateProfileService } from '../candidate-profile/candidate-profile.service';
import { Apply } from '@prisma/client';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import { jobService } from '../job/job.service';
import { BadRequestException, ForbiddenException, NotFountException } from '~/globals/cores/error.cores';
import { IApplyStatus } from './apply.interface';
import { getIo } from '~/socketManager';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

class ApplyService {
    // candidate apply for a job
    public async create(jobId: number, currentUser: UserPayLoad) {
        const candidateProfile = await candidateProfileService.readOne(currentUser.id);
        // await jobService.readOne(jobId);
        const job = await jobService.findOneActive(jobId);
        const alreadyApply = await this.findCandidateWithJobId(candidateProfile.id, jobId);

        if (alreadyApply !== null) {
            throw new BadRequestException(`You can't apply to the same job again.`);
        }

        const fullApply = await prisma.apply.create({
            data: {
                candidateProfileId: candidateProfile.id,
                jobId,
                companyId: job.companyId
            },
            select: {
                id: true,
                applyDate: true,
                status: true,
                companyId: true,
                candidateProfileId: true,
                jobId: true,
                candidateProfile: {
                    select: {
                        id: true,
                        fullName: true,
                        gender: true,
                        phone: true,
                        cv: true,
                        birthDate: true,
                        address: true,
                        userId: true
                    }
                }
            }
        });

        const apply = {
            id: fullApply.id,
            applyDate: fullApply.applyDate,
            status: fullApply.status,
            companyId: fullApply.companyId,
            candidateProfileId: fullApply.candidateProfileId,
            jobId: fullApply.jobId
        };

        const applyForRecruiter = {
            applyDate: fullApply.applyDate,
            status: fullApply.status,
            candidateProfile: {
                id: fullApply.candidateProfile.id,
                fullName: fullApply.candidateProfile.fullName,
                gender: fullApply.candidateProfile.gender,
                phone: fullApply.candidateProfile.phone,
                cv: fullApply.candidateProfile.cv,
                birthDate: fullApply.candidateProfile.birthDate,
                address: fullApply.candidateProfile.address,
                userId: fullApply.candidateProfile.userId
            }
        };

        //for cadidate
        await redisClient.rpop(RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE(currentUser.id));
        redisClient.lpushx(RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE(currentUser.id), JSON.stringify(apply));

        // if pagination exists then increament it for candidate
        if (await redisClient.exists(RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE_PAGINATION(currentUser.id))) {
            await redisClient.incr(RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE_PAGINATION(currentUser.id));
        }

        //for recruiter
        await redisClient.rpop(RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER(apply.jobId, apply.companyId));
        redisClient.lpushx(
            RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER(apply.jobId, apply.companyId),
            JSON.stringify(applyForRecruiter)
        );

        // if pagination exists then increament it for recruiter
        if (
            await redisClient.exists(
                RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER_PAGINATION(apply.jobId, apply.companyId)
            )
        ) {
            await redisClient.incr(
                RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER_PAGINATION(apply.jobId, apply.companyId)
            );
        }

        return apply;
    }

    public async readMyApplicationsForCandidate(
        { page, limit }: { page: number; limit: number },
        currentUser: UserPayLoad
    ) {
        const start = (page - 1) * limit;
        let end = start + limit - 1;

        const cacheLen = await redisClient.llen(RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE(currentUser.id));

        console.log({ start, end, cacheLen, page, limit });

        if (cacheLen > 0 && end < cacheLen) {
            const pagination = await redisClient.get(
                RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE_PAGINATION(currentUser.id)
            );

            let totalCount;
            if (pagination) {
                totalCount = JSON.parse(pagination);
            }
            console.log({ totalCount });

            const maxPage = Math.ceil(totalCount / limit);

            console.log('inside redis condition');

            const cacheData = await redisClient.lrange(
                RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE(currentUser.id),
                start,
                end
            );
            const data = cacheData.map((r) => JSON.parse(r));

            return { apply: data, totalCount, totalPages: maxPage };
        }

        const condidateProfile = await candidateProfileService.readOne(currentUser.id);

        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter: '',
            filterFields: [],
            entity: 'apply',
            additionCondition: { candidateProfileId: condidateProfile.id },
            orderCondition: { applyDate: 'desc' },
            include: { company: { select: { id: true, name: true } }, job: { select: { id: true, title: true } } },
            omit: { companyId: true, jobId: true }
        });

        const isPaginationExist = await redisClient.exists(
            RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE_PAGINATION(currentUser.id)
        );

        const isExist = await redisClient.exists(RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE(currentUser.id));
        if (!isExist && !isPaginationExist) {
            const rows = await prisma.apply.findMany({
                where: { candidateProfileId: condidateProfile.id },
                orderBy: { applyDate: 'desc' },
                take: 50, // how much application you want to cache
                include: { company: { select: { id: true, name: true } }, job: { select: { id: true, title: true } } },
                omit: { companyId: true, jobId: true }
            });
            if (rows.length > 0) {
                redisClient.rpush(
                    RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE(currentUser.id),
                    ...rows.map((r) => JSON.stringify(r))
                );
                redisClient.expire(RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE(currentUser.id), 7200); // 2 hour
                redisClient.set(
                    RedisKey.APPLY.READ_MY_APPLICATION_CANDIDATE_PAGINATION(currentUser.id),
                    JSON.stringify(totalCount),
                    'EX',
                    7200 // 2 hour
                );
            }
        }
        // }

        console.log('db call');
        return { apply: data, totalCount, totalPages };
    }

    public async readMyApplicationsForRECRUITER(
        { page, limit }: { page: number; limit: number },
        jobId: number,
        companyId: number,
        currentUser: UserPayLoad
    ) {
        const job = await jobService.findOne(jobId, companyId, currentUser.id);
        console.log({ jobId: job.id, companyId: job.companyId });

        const start = (page - 1) * limit;
        let end = start + limit - 1;

        const cacheLen = await redisClient.llen(RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER(job.id, job.companyId));

        console.log({ start, end, cacheLen, page, limit });

        if (cacheLen > 0 && end < cacheLen) {
            const pagination = await redisClient.get(
                RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER_PAGINATION(job.id, job.companyId)
            );

            let totalCount;
            if (pagination) {
                totalCount = JSON.parse(pagination);
            }

            console.log({ totalCount });
            console.log('inside redis condition');

            const cacheData = await redisClient.lrange(
                RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER(job.id, job.companyId),
                start,
                end
            );

            const data = cacheData.map((r) => JSON.parse(r));
            const maxPage = Math.ceil(totalCount / limit);

            return { apply: data, totalCount, totalPages: maxPage };
        }

        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter: '',
            filterFields: [],
            entity: 'apply',
            additionCondition: { jobId: job.id },
            orderCondition: { applyDate: 'desc' },
            include: {
                candidateProfile: { select: { id: true, fullName: true, summary: true, address: true } },
                job: { select: { id: true, title: true } }
            },
            omit: { jobId: true, candidateProfileId: true }
        });

        const isPaginationExist = await redisClient.exists(
            RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER_PAGINATION(job.id, job.companyId)
        );

        const isExist = await redisClient.exists(RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER(job.id, job.companyId));
        if (!isExist && !isPaginationExist) {
            const rows = await prisma.apply.findMany({
                where: { jobId: job.id },
                orderBy: { applyDate: 'desc' },
                take: 50, // how much application you want to cache
                select: {
                    applyDate: true,
                    status: true,
                    // jobId: true,
                    candidateProfile: {
                        select: {
                            id: true,
                            fullName: true,
                            gender: true,
                            phone: true,
                            cv: true,
                            birthDate: true,
                            address: true,
                            userId: true
                        }
                    }
                }
            });

            if (rows.length > 0) {
                console.log({ jobId: job.id, companyId: job.companyId });
                redisClient.rpush(
                    RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER(job.id, job.companyId),
                    ...rows.map((r) => JSON.stringify(r))
                );
                redisClient.expire(RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER(job.id, job.companyId), 7200);
                redisClient.set(
                    RedisKey.APPLY.READ_MY_APPLICATION_RECRUITER_PAGINATION(job.id, job.companyId),
                    JSON.stringify(totalCount),
                    'EX',
                    7200
                );
            }
        }

        console.log('db call');
        return { apply: data, totalCount, totalPages };
    }

    // private method
    public async findCandidateWithJobId(candidateProfileId: number, jobId: number): Promise<Apply | null> {
        const apply = await prisma.apply.findFirst({
            where: {
                candidateProfileId,
                jobId
            }
        });

        // if (!apply) throw new NotFountException(`Can't find application`);

        return apply;
    }

    public async readApplicationByIdForRecruiter(jobId: number, candidateProfileId: number) {
        const apply = await prisma.apply.findFirst({
            where: { jobId, candidateProfileId }
        });

        if (!apply) throw new ForbiddenException(`You don't have access.`);

        const application = prisma.apply.findUnique({
            where: {
                candidateProfileId_jobId: {
                    candidateProfileId,
                    jobId
                }
            },
            include: {
                job: { select: { id: true, title: true } }
            },
            omit: { jobId: true, candidateProfileId: true }
        });

        return application;
    }

    public async updateStatus(
        requestBody: IApplyStatus,
        jobId: number,
        companyId: number,
        currentUser: UserPayLoad
    ): Promise<Apply> {
        const { candidateProfileId, status } = requestBody;

        await jobService.findOne(jobId, companyId, currentUser.id);
        await this.findCandidateWithJobId(candidateProfileId, jobId);

        const apply = await prisma.apply.update({
            where: {
                candidateProfileId_jobId: {
                    candidateProfileId,
                    jobId
                }
            },
            data: {
                status
            }
        });

        // Emit status update event to candidate in real time
        const io = getIo();
        // io.to(`candidate_10`).emit('statusUpdated', {
        io.to(`candidate_${currentUser.id}`).emit('statusUpdated', {
            jobId,
            status
        });

        return apply;
    }
}

export const applyService: ApplyService = new ApplyService();

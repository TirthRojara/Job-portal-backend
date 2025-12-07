import { JobRole } from '@prisma/client';
import { strict } from 'assert';
import { RedisKey } from '~/globals/constants/redis.constant';
import { NotFountException } from '~/globals/cores/error.cores';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import prisma from '~/prisma';

class JobRoleService {
    public async create(name: string): Promise<JobRole> {
        const jobRole = await prisma.jobRole.create({
            data: { name }
        });

        await redisClient.del(RedisKey.JOB_ROLL);

        return jobRole;
    }

    public async readAll({ page, limit, filter }: { page: number; limit: number; filter: string }) {
        const cacheData = await redisClient.get(RedisKey.JOB_ROLL);
        if (cacheData) return JSON.parse(cacheData);

        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter,
            filterFields: ['name'],
            entity: 'jobRole'
        });

        redisClient.set(RedisKey.JOB_ROLL, JSON.stringify({ jobRole: data, totalCount, totalPages }), 'EX', 86400);

        return { jobRole: data, totalCount, totalPages };
    }

    public async findOne(jobRoleId: number): Promise<JobRole> {
        const jobRole = await prisma.jobRole.findUnique({
            where: { id: jobRoleId }
        });

        if (!jobRole) throw new NotFountException(`Job role with id: ${jobRoleId} does not exist`);

        return jobRole;
    }

    public async remove(jobRoleId: number): Promise<void> {
        await this.findOne(jobRoleId);

        await prisma.jobRole.delete({
            where: { id: jobRoleId }
        });

        await redisClient.del(RedisKey.JOB_ROLL);
    }
}

export const jobRoleService: JobRoleService = new JobRoleService();

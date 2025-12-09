import prisma from '~/prisma';
import { ICompanyCreateUpdate } from './company.interface';
import { Company, Prisma } from '@prisma/client';
import { getTeamSizeLabel } from '~/globals/helpers/getTeamSizeLabel.helper';
import { BadRequestException, NotFountException } from '~/globals/cores/error.cores';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';
import { count } from 'console';
import { companyRedis } from './company.redis';

class CompanyService {
    public async create(requestBody: ICompanyCreateUpdate, userId: number): Promise<Company> {
        const { totalEmployees, establishedDate, ...rest } = requestBody;

        const company = await prisma.company.create({
            data: {
                ...rest,
                establishedDate: new Date(establishedDate),
                userId,
                totalEmployees,
                teamSizeLabel: getTeamSizeLabel(totalEmployees)
            }
        });

        await redisClient.del(RedisKey.COMPANY.ME(userId));

        return company;
    }

    // public async readAll(): Promise<Company[]> {
    //   const companies = await prisma.company.findMany();
    //   return companies;
    // }

    public async readAllPagination({ page, limit, filter }: { page: number; limit: number; filter: string }) {
        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter,
            filterFields: ['name', 'description'],
            entity: 'company'
        });

        return { companies: data, totalCount, totalPages };
    }

    public async readAllIsApproved(
        { page, limit, filter }: { page: number; limit: number; filter: string },
        isApproved: boolean
    ) {
        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter,
            filterFields: ['name', 'description'],
            entity: 'company',
            additionCondition: { isApproved }
        });

        return { companies: data, totalCount, totalPages };
    }

    public async readMyCompanies(
        { page, limit, filter }: { page: number; limit: number; filter: string },
        currentUser: UserPayLoad
    ) {
        // const companies = await prisma.company.findMany({
        //   where: {
        //     userId: currentUser.id
        //   }
        // });

        const cacheData = await redisClient.get(RedisKey.COMPANY.ME(currentUser.id));
        if (cacheData) return JSON.parse(cacheData);

        const { data, totalCount, totalPages } = await getPaginationAndFilter({
            page,
            limit,
            filter,
            filterFields: ['name', 'description'],
            entity: 'company',
            additionCondition: { userId: currentUser.id }
        });

        redisClient
            .set(
                RedisKey.COMPANY.ME(currentUser.id),
                JSON.stringify({ companies: data, totalCount, totalPages }),
                'EX',
                7200
            )
            .catch((err) => console.error('Redis set failed', err));

        return { companies: data, totalCount, totalPages };
    }

    public async readOne(id: number, currentUser: UserPayLoad): Promise<Omit<Company, 'views'>> {
        // incr views
        companyRedis.INCR_views(currentUser.id, id);

        const cacheData = await redisClient.get(RedisKey.COMPANY.ID(id));
        if (cacheData) return JSON.parse(cacheData);

        const company = await prisma.company.findUnique({
            where: { id },
            omit: { views: true }
        });

        if (!company) throw new NotFountException(`Can't find company with id ${id}`);

        redisClient
            .set(RedisKey.COMPANY.ID(id), JSON.stringify(company), 'EX', 43200)
            .catch((err) => console.error('Redis set failed', err)); //  12H

        return company;
    }

    // private method
    public async findOne(companyId: number, userId: number) {
        const company = await prisma.company.findFirst({
            where: {
                userId,
                id: companyId
            }
        });

        if (!company) throw new NotFountException(`Can't find company with id ${companyId} for user ${userId}`);

        return company;
    }

    public async update(id: number, requestBody: ICompanyCreateUpdate, currentUser: UserPayLoad) {
        const { totalEmployees, establishedDate, ...rest } = requestBody;

        await this.findOne(id, currentUser.id);

        const company = await prisma.company.update({
            where: { id, userId: currentUser.id },
            data: {
                ...rest,
                establishedDate: establishedDate ? new Date(establishedDate) : undefined,
                totalEmployees,
                teamSizeLabel: totalEmployees ? getTeamSizeLabel(totalEmployees) : undefined
            }
        });

        await redisClient.del(RedisKey.COMPANY.ME(currentUser.id));
        await redisClient.del(RedisKey.COMPANY.ID(company.id));

        return company;
    }

    //private
    public async readOneWithoutUserId(companyId: number) {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            omit: { views: true }
        });

        if (!company) throw new NotFountException(`Can't find company with id ${companyId}`);

        return company;
    }

    public async approved(id: number, isApproved: boolean) {
        await this.readOneWithoutUserId(id);

        const company = await prisma.company.update({
            where: { id },
            data: { isApproved }
        });

        return company;
    }

    public async remove(id: number, currentUser: UserPayLoad): Promise<void> {
        await this.findOne(id, currentUser.id);

        await prisma.company.delete({
            where: { id, userId: currentUser.id }
        });

        await redisClient.del(RedisKey.COMPANY.ME(currentUser.id));
    }

    public async removeByAdmin(id: number): Promise<void> {
        await this.readOneWithoutUserId(id);

        const company = await prisma.company.delete({
            where: { id }
        });

        await redisClient.del(RedisKey.COMPANY.ID(company.id));
        await redisClient.del(RedisKey.COMPANY.ME(company.userId));
    }

    public async getCompanyView(companyId: number, currentUser: UserPayLoad) {
        await this.findOne(companyId, currentUser.id);

        const redisCount = await redisClient.get(RedisKey.COMPANY.VIEWS_COUNT(companyId));

        const dbCount = await prisma.company.findUnique({
            where: { id: companyId },
            select: { id: true, views: true }
        });

        if (!dbCount) throw new BadRequestException('Invalid request');

        const totalCount = Number(redisCount) + dbCount!.views!;

        return { companyId: dbCount.id, totalViews: totalCount };
    }

    public async syncViewInDB() {
        // const keys = await redisClient.keys(`company:*:views:count`);

        // for (const key of keys) {
        //     const companyId = key.split(':')[1]; // Extract from "company:123:views:count"

        //     let isValue = await redisClient.get(RedisKey.COMPANY.VIEWS_COUNT(companyId));

        //     if (isValue) {
        //         const count = Number(isValue);

        //         const views = await prisma.company.update({
        //             where: { id: Number(companyId) },
        //             data: { views: { increment: count } }
        //         });
        //     }

        //     redisClient.del(RedisKey.COMPANY.VIEWS_COUNT(companyId))
        // }

        // 1. Distributed lock (prevents duplicate runs across PM2/Docker instances)
        const lockKey = 'lock:cron:views-sync';
        const lockAcquired = await redisClient.set(lockKey, '1', 'EX', 300, 'NX'); // 5min TTL
        if (!lockAcquired) {
            console.log('Cron skipped - another instance running');
            return;
        }

        const keys: string[] = [];
        let cursor = '0';

        try {
            // 2. SCAN all keys (non-blocking)
            // do {
            //     const result = await redisClient.scan(cursor, {
            //         MATCH: 'company:*:views:count',
            //         COUNT: 100
            //     });
            //     cursor = result.cursor;
            //     keys.push(...result.keys);
            // } while (cursor !== '0');

            do {
                const [nextCursor, elements] = await redisClient.scan(
                    cursor,
                    'MATCH',
                    'company:*:views:count',
                    'COUNT',
                    '100'
                );

                cursor = nextCursor;
                keys.push(...elements);
            } while (cursor !== '0');

            if (keys.length === 0) return;

            console.log(`Found ${keys.length} companies to sync`);

            // 3. Build batch updates
            const updates: any[] = [];
            for (const key of keys) {
                const companyId = key.split(':')[1];
                const count = Number((await redisClient.get(key)) || '0');

                if (count > 0) {
                    updates.push(
                        prisma.company.update({
                            where: { id: Number(companyId) },
                            data: { views: { increment: count } }
                        })
                    );
                }
            }

            if (updates.length === 0) return;

            // 4. Atomic DB update FIRST
            await prisma.$transaction(updates);
            console.log(`✅ Synced ${updates.length} companies to DB`);

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
            console.log('lock relese: syncViewInDb for company');
        }
    }
}

export const companyService: CompanyService = new CompanyService();

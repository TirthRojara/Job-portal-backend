import prisma from '~/prisma';
import { ICompanyCreateUpdate } from './company.interface';
import { Company, Prisma } from '@prisma/client';
import { getTeamSizeLabel } from '~/globals/helpers/getTeamSizeLabel.helper';
import { NotFountException } from '~/globals/cores/error.cores';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

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

    public async readOne(id: number): Promise<Company> {
        const cacheData = await redisClient.get(RedisKey.COMPANY.ID(id));
        if (cacheData) return JSON.parse(cacheData);

        const company = await prisma.company.findUnique({
            where: { id }
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

    public async approved(id: number, isApproved: boolean) {
        await this.readOne(id);

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
        await this.readOne(id);

        const company = await prisma.company.delete({
            where: { id }
        });

        await redisClient.del(RedisKey.COMPANY.ID(company.id));
        await redisClient.del(RedisKey.COMPANY.ME(company.userId))
    }
}

export const companyService: CompanyService = new CompanyService();

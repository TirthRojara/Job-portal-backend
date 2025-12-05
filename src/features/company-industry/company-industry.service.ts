import prisma from '~/prisma';
import { companyService } from '../company/company.service';
import { NotFountException } from '~/globals/cores/error.cores';
import { Industry } from '@prisma/client';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

class CompanyIndustryService {
    public async getAllIndustries(): Promise<Industry[]> {
        const cacheData = await redisClient.get(RedisKey.INDUSTRY);
        if (cacheData) return JSON.parse(cacheData);

        const industries = await prisma.industry.findMany();

        redisClient
            .set(RedisKey.INDUSTRY, JSON.stringify(industries), 'EX', 86400)
            .catch((err) => console.error('Redis set failed', err));

        return industries;
    }

    private async findIndustry(industryId: number) {
        const industry = await prisma.industry.findUnique({
            where: { id: industryId }
        });

        if (!industry) throw new NotFountException(`Industry with id: ${industryId} not found`);

        return industry;
    }

    public async add(industryId: number, companyId: number, currentUser: UserPayLoad) {
        const company = await companyService.findOne(companyId, currentUser.id);
        await this.findIndustry(industryId);

        const companyIndustry = await prisma.companyIndustry.create({
            data: {
                companyId: company.id,
                industryId
            }
        });

        await redisClient.del(RedisKey.COMPANY.INDUSTRY(companyId));

        return companyIndustry;
    }

    public async getCompanyIndustry(companyId: number) {
        const cacheData = await redisClient.get(RedisKey.COMPANY.INDUSTRY(companyId));
        if (cacheData) return JSON.parse(cacheData);

        await companyService.readOne(companyId);
        const companyIndustry = await prisma.companyIndustry.findMany({
            where: { companyId }
        });

        if (companyIndustry.length === 0) throw new NotFountException(`No data found in company with id: ${companyId}`);

        redisClient
            .set(RedisKey.COMPANY.INDUSTRY(companyId), JSON.stringify(companyIndustry), 'EX', 43200)
            .catch((err) => console.error('Redis set failed', err));

        return companyIndustry;
    }

    public async remove(industryId: number, companyId: number, currentUser: UserPayLoad): Promise<void> {
        const company = await companyService.findOne(companyId, currentUser.id);
        await this.findIndustry(industryId);

        await prisma.companyIndustry.delete({
            where: { companyId_industryId: { companyId: company.id, industryId } }
        });

        await redisClient.del(RedisKey.COMPANY.INDUSTRY(companyId));
    }
}

export const companyIndustryService: CompanyIndustryService = new CompanyIndustryService();

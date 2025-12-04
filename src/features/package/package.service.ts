import prisma from '~/prisma';
import { IPackage } from './package.interface';
import { Package } from '@prisma/client';
import { NotFountException } from '~/globals/cores/error.cores';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

class PackageService {
    public async create(requestBody: IPackage) {
        const { ...rest } = requestBody;

        const pkg = await prisma.package.create({
            data: { ...rest }
        });

        return pkg;
    }

    public async readAll(): Promise<Package[]> {
        const pkg = await prisma.package.findMany();
        return pkg;
    }

    public async readAllForRecruiter(): Promise<Package[]> {
        const catchData = await redisClient.get(`${RedisKey.PACKAGE.ALL}`);
        if (catchData) return JSON.parse(catchData) as Package[];

        const pkg = await prisma.package.findMany({
            where: { isActive: true }
        });

        await redisClient.set(`${RedisKey.PACKAGE.ALL}`, JSON.stringify(pkg), 'EX', 86400);

        return pkg;
    }

    public async readOne(id: number): Promise<Package> {
        const pkg = await prisma.package.findUnique({
            where: { id }
        });

        if (!pkg) throw new NotFountException(`Package: ${id} not found`);

        return pkg;
    }

    public async readOneForRecruiter(id: number): Promise<Package> {
        console.log('package service,  packageId : ' + id);

        const catchData = await redisClient.get(RedisKey.PACKAGE.BY_ID(id));
        if (catchData) return JSON.parse(catchData) as Package;

        const pkg = await prisma.package.findFirst({
            where: { id: id, isActive: true }
        });

        if (!pkg) throw new NotFountException(`Package: ${id} not found`);

        await redisClient.set(RedisKey.PACKAGE.BY_ID(id), JSON.stringify(pkg), 'EX', 86400);

        return pkg;
    }

    public async update(id: number, requestBody: IPackage): Promise<Package> {
        const { ...rest } = requestBody;

        try {
            const pkg = await prisma.package.update({
                where: { id },
                data: {
                    ...rest
                }
            });

            // await redisClient.set(RedisKey.PACKAGE.BY_ID(id), JSON.stringify(pkg) , 'EX', 86400);
            await redisClient.del(RedisKey.PACKAGE.ALL, RedisKey.PACKAGE.BY_ID(id));

            return pkg;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFountException(`package does not exist.`);
            }
            throw error;
        }
    }

    public async updateStatus(id: number, isActive: boolean): Promise<Package> {
        try {
            const pkg = await prisma.package.update({
                where: { id },
                data: {
                    isActive
                }
            });

            await redisClient.del(RedisKey.PACKAGE.ALL, RedisKey.PACKAGE.BY_ID(id));

            return pkg;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFountException(`package does not exist.`);
            }

            throw error;
        }
    }
}

export const packageService: PackageService = new PackageService();

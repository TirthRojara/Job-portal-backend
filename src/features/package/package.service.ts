import prisma from '~/prisma';
import { IPackage } from './package.interface';
import { Package } from '@prisma/client';
import { NotFountException } from '~/globals/cores/error.cores';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    const pkg = await prisma.package.findMany({
      where: { isActive: true }
    });
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


    // if (typeof id !== 'number' || isNaN(id)) {
    //   throw new Error('Invalid package id');
    // }


    console.log('package service,  packageId : ' + id);
    const pkg = await prisma.package.findFirst({
      where: { id: id, isActive: true }
    });

    if (!pkg) throw new NotFountException(`Package: ${id} not found`);

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

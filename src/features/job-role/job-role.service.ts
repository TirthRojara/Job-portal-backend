import { JobRole } from '@prisma/client';
import { strict } from 'assert';
import { NotFountException } from '~/globals/cores/error.cores';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import prisma from '~/prisma';

class JobRoleService {
  public async create(name: string): Promise<JobRole> {
    const jobRole = await prisma.jobRole.create({
      data: { name }
    });

    return jobRole;
  }

  public async readAll({ page, limit, filter }: { page: number; limit: number; filter: string }) {
    const { data, totalCount, totalPages } = await getPaginationAndFilter({
      page,
      limit,
      filter,
      filterFields: ['name'],
      entity: 'jobRole'
    });

    return { jobRole: data, totalCount, totalPages };
  }

  private async findOne(jobRoleId: number): Promise<JobRole> {
    const jobRole = await prisma.jobRole.findUnique({
      where: { id: jobRoleId }
    });

    if (!jobRole) throw new NotFountException(`Job role with id: ${jobRoleId} does not exist`);

    return jobRole;
  }

  public async remove(jobRoleId: number): Promise<void> {
    await this.findOne(jobRoleId)

    await prisma.jobRole.delete({
        where: {id: jobRoleId}
    })
  }
}

export const jobRoleService: JobRoleService = new JobRoleService();

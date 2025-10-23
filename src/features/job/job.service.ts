import prisma from '~/prisma';
import { companyService } from '../company/company.service';
import { IJob } from './job.interface';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import { Job, JobStatus } from '@prisma/client';
import { NotFountException } from '~/globals/cores/error.cores';
import { jobRoleService } from '../job-role/job-role.service';
import { recruiterPackageService } from '../recruiter-package/recruiter-package.service';

class JobService {
  public async create(requestBody: IJob, currentUser: UserPayLoad, companyId: number) {
    const { applicationDeadline,jobRoleId, ...rest } = requestBody;

    await companyService.findOne(companyId, currentUser.id);
    await jobRoleService.findOne(jobRoleId)

    // get active package of the recruiter`
    const activePackage = await recruiterPackageService.findActivePackage(currentUser.id)

    // count how many job post by recruiter
    const jobCount = await prisma.job.count({
      where: {
        postById: currentUser.id
      }
    })

    

    const job = await prisma.job.create({
      data: {
        ...rest,
        applicationDeadline: new Date(applicationDeadline),
        jobRoleId,
        companyId,
        postById: currentUser.id
      }
    });

    return job;
  }

  public async readAll({
    page,
    limit,
    filter,
    salaryMin,
    JobStatus
  }: {
    page: number;
    limit: number;
    filter: string;
    salaryMin: number;
    JobStatus: string | null;
  }) {
    const additionConditionQuery: any = {
      salaryMin: { gte: salaryMin },
      isDeleted: false
    };

    if (JobStatus && JobStatus.trim() !== '') {
      additionConditionQuery.status = JobStatus; // only add valid status filter
    }

    const { data, totalCount, totalPages } = await getPaginationAndFilter({
      page,
      limit,
      filter,
      filterFields: ['title', 'description'],
      entity: 'job',
      // additionCondition: { salaryMin: { gte: salaryMin }, isDeleted: false, status: JobStatus },
      additionCondition: additionConditionQuery,
      orderCondition: { postedAt: 'desc' }
    });

    return { job: data, totalCount, totalPages };
  }

  public async readAllForRecruiter(
    {
      page,
      limit,
      filter,
      salaryMin
    }: {
      page: number;
      limit: number;
      filter: string;
      salaryMin: number;
    },
    currentUser: UserPayLoad
  ) {
    const { data, totalCount, totalPages } = await getPaginationAndFilter({
      page,
      limit,
      filter,
      filterFields: ['title', 'description'],
      entity: 'job',
      additionCondition: { salaryMin: { gte: salaryMin }, postById: currentUser.id },
      orderCondition: { postedAt: 'desc' }
    });

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

  public async readOne(id: number): Promise<Job> {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: { select: { name: true } },
        postBy: { select: { name: true } },
        jobRole: { select: { name: true } }
      }
    });

    if (!job) throw new NotFountException(`Can't find job with id: ${id}`);

    return job;
  }

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

    return job;
  }

  public async updateStatus(id: number, companyId: number, currentUser: UserPayLoad, status: JobStatus): Promise<Job> {
    await this.findOne(id, companyId, currentUser.id);

    const job = await prisma.job.update({
      where: { id, companyId, postById: currentUser.id },
      data: {
        status
      }
    });

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
}

export const jobService: JobService = new JobService();

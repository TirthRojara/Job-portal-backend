import prisma from '~/prisma';
import { candidateProfileService } from '../candidate-profile/candidate-profile.service';
import { Apply } from '@prisma/client';
import { getPaginationAndFilter } from '~/globals/helpers/pagination-filter.helper';
import { jobService } from '../job/job.service';
import { BadRequestException, NotFountException } from '~/globals/cores/error.cores';
import { IApplyStatus } from './apply.interface';

class ApplyService {
  // add feature - if missing skill then show to both C and R.
  // candidate apply for a job
  public async create(jobId: number, currentUser: UserPayLoad): Promise<Apply> {
    const candidateProfile = await candidateProfileService.readOne(currentUser.id);
    await jobService.readOne(jobId);
    await jobService.findOneActive(jobId);
    const alreadyApply = await this.findCandidateWithJobId(candidateProfile.id, jobId)

    if (alreadyApply) {
        throw new BadRequestException(`You can't apply to the same job`)
    }

    const apply = await prisma.apply.create({
      data: {
        candidateProfileId: candidateProfile.id,
        jobId
      }
    });

    return apply;
  }

  public async readMyApplicationsForCandidate(
    { page, limit }: { page: number; limit: number },
    currentUser: UserPayLoad
  ) {
    const condidateProfile = await candidateProfileService.readOne(currentUser.id);

    const { data, totalCount, totalPages } = await getPaginationAndFilter({
      page,
      limit,
      filter: '',
      filterFields: [],
      entity: 'apply',
      additionCondition: { candidateProfileId: condidateProfile.id },
      orderCondition: { applyDate: 'desc' }
    });

    return { apply: data, totalCount, totalPages };
  }

  public async readMyApplicationsForRECRUITER(
    { page, limit }: { page: number; limit: number },
    jobId: number,
    companyId: number,
    currentUser: UserPayLoad
  ) {
    const job = await jobService.findOne(jobId, companyId, currentUser.id);

    const { data, totalCount, totalPages } = await getPaginationAndFilter({
      page,
      limit,
      filter: '',
      filterFields: [],
      entity: 'apply',
      additionCondition: { jobId: job.id },
      orderCondition: { applyDate: 'desc' },
      include: {},
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
            address: true
          }
        }
      }
    });

    // await prisma.apply.findMany({
    //   where: { jobId: job.id },
    //   include: {
    //     candidateProfile: {
    //       select: {
    //         id: true,
    //         fullName: true,
    //         gender: true,
    //         phone: true,
    //         cv: true,
    //         birthDate: true,
    //         address: true
    //       }
    //     }
    //   }
    // });
    // await prisma.apply.findMany({
    //   where: { jobId: job.id },
    //   select: {
    //     applyDate: true,
    //     status: true,
    //     jobId: true,
    //     candidateProfile: {
    //       select: {
    //         id: true,
    //         fullName: true,
    //         gender: true,
    //         phone: true,
    //         cv: true,
    //         birthDate: true,
    //         address: true
    //       }
    //     }
    //   }
    // });

    return { apply: data, totalCount, totalPages };
  }

  public async findCandidateWithJobId(candidateProfileId: number, jobId: number): Promise<Apply> {
    const apply = await prisma.apply.findUnique({
      where: {
        candidateProfileId_jobId: {
          candidateProfileId,
          jobId
        }
      }
    });

    if (!apply) throw new NotFountException(`Can't find application`);

    return apply;
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

    return apply;
  }
}

export const applyService: ApplyService = new ApplyService();

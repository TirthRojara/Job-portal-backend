import prisma from '~/prisma';
import { jobService } from '../job/job.service';
import { JobSkill } from '@prisma/client';
import { candidateSkillService } from '../candidate-skill/candidate-skill.service';

class JobSkillService {
  public async create(jobId: number, skillId: number, currentUser: UserPayLoad): Promise<JobSkill> {
    await jobService.findJobByUser(jobId, currentUser.id);

    const jobSkill = await prisma.jobSkill.create({
      data: {
        jobId,
        skillId
      }
    });

    return jobSkill;
  }

  public async read(jobId: number) {
    const jobSkillRecords = await prisma.jobSkill.findMany({
      where: { jobId },
      //   include: { skill: true }
      select: {
        jobId: false,
        skillId: false,
        skill: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    const jobSkill = jobSkillRecords.map((record) => record.skill);

    return jobSkill;
  }

  public async remove(jobId: number, skillId: number, currentUser: UserPayLoad): Promise<void> {
    await jobService.findJobByUser(jobId, currentUser.id);
    await candidateSkillService.findSkill(skillId)

    await prisma.jobSkill.delete({
        where: {
            jobId_skillId: {
                jobId,
                skillId
            }
        }
    })
  }
}

export const jobSkillService: JobSkillService = new JobSkillService();

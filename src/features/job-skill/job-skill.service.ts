import prisma from '~/prisma';
import { jobService } from '../job/job.service';
import { JobSkill } from '@prisma/client';
import { candidateSkillService } from '../candidate-skill/candidate-skill.service';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';

class JobSkillService {
    public async create(jobId: number, skillId: number, currentUser: UserPayLoad) {
        await jobService.findJobByUser(jobId, currentUser.id);

        const jobSkill = await prisma.jobSkill.create({
            data: {
                jobId,
                skillId
            },
            select: {
                jobId: true,
                skill: {
                    select: { id: true, name: true }
                }
            }
        });

        await redisClient.del(RedisKey.JOB.SKILL(jobId));

        return jobSkill;
    }

    public async read(jobId: number) {
        const cacheData = await redisClient.get(RedisKey.JOB.SKILL(jobId));
        if (cacheData) return JSON.parse(cacheData);

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

        redisClient
            .set(RedisKey.JOB.SKILL(jobId), JSON.stringify(jobSkill), 'EX', 43200)
            .catch((err) => console.error('Redis set failed', err));

        return jobSkill;
    }

    public async remove(jobId: number, skillId: number, currentUser: UserPayLoad): Promise<void> {
        await jobService.findJobByUser(jobId, currentUser.id);
        await candidateSkillService.findSkill(skillId);

        await prisma.jobSkill.delete({
            where: {
                jobId_skillId: {
                    jobId,
                    skillId
                }
            }
        });

        await redisClient.del(RedisKey.JOB.SKILL(jobId));
    }
}

export const jobSkillService: JobSkillService = new JobSkillService();

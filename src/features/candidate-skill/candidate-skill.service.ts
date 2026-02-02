import { CandidateSkill, Skill } from '@prisma/client';
import prisma from '~/prisma';
import { NotFountException } from '~/globals/cores/error.cores';
import { IreadAllCandidateSkillz, IreadMySkill } from './candidate-skill.interface';
import { candidateProfileService } from '../candidate-profile/candidate-profile.service';
import { redisClient } from '~/globals/cores/redis/redis.client';
import { RedisKey } from '~/globals/constants/redis.constant';
import { json } from 'body-parser';
import { JsonWebTokenError } from 'jsonwebtoken';

class CandidateSkillService {
    public async getAllSkill(): Promise<Skill[]> {
        const cacheData = await redisClient.get(RedisKey.SKILLS);
        if (cacheData) return JSON.parse(cacheData);

        const skills = await prisma.skill.findMany();

        redisClient.set(RedisKey.SKILLS, JSON.stringify(skills), 'EX', 86400);

        return skills;
    }

    public async findSkill(id: number): Promise<Skill> {
        const skill = await prisma.skill.findUnique({
            where: { id }
        });

        if (!skill) throw new NotFountException(`Cannot find skill with name ${id}`);

        return skill;
    }

    public async create(skillId: any, currentUser: UserPayLoad): Promise<IreadMySkill> {
        const candidateProfile = await candidateProfileService.readOne(currentUser.id);
        await this.findSkill(skillId);

        const candidateskill = await prisma.candidateSkill.create({
            data: {
                candidateProfileId: candidateProfile.id,
                skillId
            },
            select: {
                skill: { select: { id: true, name: true } }
            }
        });

        return candidateskill;
    }

    public async readAllUserSkill(): Promise<IreadAllCandidateSkillz[]> {
        const candidateSkills = await prisma.candidateSkill.findMany({
            // include: {
            //     skill: true
            // }

            select: {
                candidateProfileId: true,
                skill: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }

            // Don't mix top-level select and include together; nest select inside include if needed.
        });

        return candidateSkills;
    }

    public async readMySkill(userId: number): Promise<IreadMySkill[]> {
        const cacheData = await redisClient.get(RedisKey.USER.CANDIDATE_SKILL(userId));
        if (cacheData) return JSON.parse(cacheData);

        const candidateProfileIdWithSkill = await prisma.candidateProfile.findUnique({
            where: { userId },
            select: {
                CandidateSkill: {
                    select: {
                        // candidateProfileId: true,
                        skill: { select: { id: true, name: true } }
                    }
                }
            }
        });

        if (!candidateProfileIdWithSkill) {
            throw new NotFountException('Candidate profile not found');
        }

        if (candidateProfileIdWithSkill.CandidateSkill.length === 0) {
            throw new NotFountException('No skills found for this candidate');
        }

        redisClient.set(
            RedisKey.USER.CANDIDATE_SKILL(userId),
            JSON.stringify(candidateProfileIdWithSkill.CandidateSkill),
            'EX',
            7200
        );

        return candidateProfileIdWithSkill.CandidateSkill;
    }

    public async remove(skillId: number, userId: number): Promise<void> {
        const candidateProfile = await candidateProfileService.readOne(userId);
        // await this.findSkill(skillId);

        await prisma.candidateSkill.delete({
            where: {
                candidateProfileId_skillId: {
                    candidateProfileId: candidateProfile.id,
                    skillId
                }
            }
        });

        await redisClient.del(RedisKey.USER.CANDIDATE_SKILL(userId));
    }
}

export const candidateSkillService: CandidateSkillService = new CandidateSkillService();

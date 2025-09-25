import Joi, { object } from 'joi';

export const candidateSkillSchema = Joi.object({
    skillId: Joi.number().required().strict()
})



import Joi from 'joi';

export const aiCandidateSummarySchema = Joi.object({
    summary: Joi.string().max(2500).allow('').optional(),
    skills: Joi.array().items(Joi.string()).max(50).optional()
});

export const aiJobPostSchema = Joi.object({
    prompt: Joi.string().max(2500).allow('').optional(),
    title: Joi.string().max(200).allow('').optional(),
    description: Joi.string().max(2500).allow('').optional(),
    responsibilities: Joi.string().max(2500).allow('').optional(),
    requirements: Joi.string().max(2500).allow('').optional()
});

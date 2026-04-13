import Joi from 'joi';

export const aiCandidateSummarySchema = Joi.object({
  summary: Joi.string().max(2500).optional(),
  skills: Joi.array().length(150).items(Joi.string()).optional()
});

import Joi from 'joi';

export const aiCandidateSummarySchema = Joi.object({
  summary: Joi.string().max(2500).allow("").optional(),
  skills:  Joi.array().items(Joi.string()).max(50).optional()
});

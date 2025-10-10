import Joi from 'joi';

export const applyStatusSchema = Joi.object({
  candidateProfileId: Joi.number().required(),
  status: Joi.string().required().valid('VIEWED', 'SELECTED', 'NOTSELECT', 'INTOUCH')
});

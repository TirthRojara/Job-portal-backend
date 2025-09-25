import Joi, { object } from 'joi';

export const candidateExperienceCreateSchema = Joi.object({
  companyName: Joi.string().required(),
  department: Joi.string().required(),
  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/) // correct usage for string schemas
    .optional()
    .messages({ 'string.pattern.base': 'startDate must be in YYYY-MM-DD format' }),

  // endDate: Joi.string()
  //   .pattern(/^\d{4}-\d{2}-\d{2}$/) // correct usage for string schemas
  //   .optional()
  //   .messages({ 'string.pattern.base': 'endDate must be in YYYY-MM-DD format' }),

  endDate: Joi.alternatives().conditional('currentlyWorking', {
    is: true,
    then: Joi.valid(null, '').optional(), // null or empty if currentlyWorking is true
    otherwise: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({ 'string.pattern.base': 'endDate must be in YYYY-MM-DD format' })
  }),

  position: Joi.string().required(),
  description: Joi.string().required(),
  currentlyWorking: Joi.boolean().required().strict(),
  workPlace: Joi.string().required().valid('ONSITE', 'REMOTE', 'HYBRID'),
  location: Joi.string().required()
});

export const candidateExperienceUpdateSchema = Joi.object({
  companyName: Joi.string().optional(),
  department: Joi.string().optional(),

  startDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/) // correct usage for string schemas
    .optional()
    .messages({ 'string.pattern.base': 'startDate must be in YYYY-MM-DD format' }),

  // endDate: Joi.string()
  //   .pattern(/^\d{4}-\d{2}-\d{2}$/) // correct usage for string schemas
  //   .optional()
  //   .messages({ 'string.pattern.base': 'endDate must be in YYYY-MM-DD format' }),

  endDate: Joi.alternatives().conditional('currentlyWorking', {
    is: true,
    then: Joi.valid(null, '').optional(), // null or empty if currentlyWorking is true
    otherwise: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/)
      .required()
      .messages({
        'any.required': 'if currentlyWorking is false then endDate is required',
        'string.pattern.base': 'endDate must be in YYYY-MM-DD format'
      })
  }),

  position: Joi.string().optional(),
  description: Joi.string().optional(),
  currentlyWorking: Joi.boolean().optional().strict(),
  workPlace: Joi.string().optional().valid('ONSITE', 'REMOTE', 'HYBRID'),
  location: Joi.string().optional()
});

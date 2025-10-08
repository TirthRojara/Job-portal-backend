import Joi from 'joi';

const workPlaceEnum = ['ONSITE', 'REMOTE', 'HYBRID'];
const jobStatusEnum = ['ACTIVE', 'PENDING', 'EXPIRED', 'REJECTED'];

export const jobCreateSchema = Joi.object({
  title: Joi.string().min(1).max(255).required().trim(),
  description: Joi.string().min(1).required().trim(),
  responsibilities: Joi.string().min(1).required().trim(),
  requirements: Joi.string().min(1).required(),
  location: Joi.string().min(1).max(255).required(),
  workplace: Joi.string()
    .valid(...workPlaceEnum)
    .required(),
  status: Joi.string()
    .valid(...jobStatusEnum)
    .required(),
  salaryMin: Joi.number().integer().min(0).required(),
  salaryMax: Joi.number().integer().min(Joi.ref('salaryMin')).required(),
  applicationDeadline: Joi.date().required(),
  jobRoleId: Joi.number().integer().required()
});

export const jobUpdateSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional().trim(),
  description: Joi.string().min(1).optional().trim(),
  responsibilities: Joi.string().min(1).optional().trim(),
  requirements: Joi.string().min(1).optional(),
  location: Joi.string().min(1).max(255).optional(),
  workplace: Joi.string()
    .valid(...workPlaceEnum)
    .optional(),
  status: Joi.string()
    .valid(...jobStatusEnum)
    .optional(),
  salaryMin: Joi.number().integer().min(0).optional(),
  salaryMax: Joi.number().integer().min(Joi.ref('salaryMin')).optional(),
  applicationDeadline: Joi.date().optional(),
  jobRoleId: Joi.number().integer().optional()
}).or(
  'title',
  'description',
  'responsibilities',
  'requirements',
  'location',
  'workplace',
  'status',
  'salaryMin',
  'salaryMax',
  'applicationDeadline',
  'jobRoleId'
);

export const jobUpdateStatusSchema = Joi.object({
  status: Joi.required().valid(...jobStatusEnum)
})
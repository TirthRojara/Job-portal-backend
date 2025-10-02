import Joi from 'joi';

export const companyCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  address: Joi.string().optional(),
  mapLink: Joi.string().optional(),
  websiteUrl: Joi.string().optional(),
  totalEmployees: Joi.number().integer().min(0).required(),
  establishedDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/) // correct usage for string schemas
    .optional()
    .messages({ 'string.pattern.base': 'startDate must be in YYYY-MM-DD format' })
});

export const companyUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  location: Joi.string().optional(),
  address: Joi.string().optional(),
  mapLink: Joi.string().optional(),
  websiteUrl: Joi.string().optional(),
  totalEmployees: Joi.number().integer().min(0).optional(),
  establishedDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/) // correct usage for string schemas
    .optional()
    .messages({ 'string.pattern.base': 'startDate must be in YYYY-MM-DD format' })
}).or(
  'name',
  'description',
  'location',
  'address',
  'mapLink',
  'websiteUrl',
  'totalEmployees',
  'establishedDate'
);

export const companyIsApprovedSchema = Joi.object({
  isApproved: Joi.boolean().required().strict()
})
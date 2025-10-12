import Joi from 'joi';

export const packageCreateSchema = Joi.object({
  label: Joi.string().required(),
  price: Joi.number().required().strict(),
  jobPostLimit: Joi.number().required().strict()
});

export const packageUpdateSchema = Joi.object({
  label: Joi.string().optional(),
  price: Joi.number().optional().strict(),
  jobPostLimit: Joi.number().optional().strict()
}).or('label', 'price', 'jobPostLimit');

export const packageIsActiveSchema = Joi.object({
  isActive: Joi.boolean().required().strict()
});

import Joi from 'joi';

export const candidateLanguageCreateSchema = Joi.object({
  languageName: Joi.string().required(),
  level: Joi.string().valid( 'BASIC', 'FLUENT', 'NATIVE').required()
});

export const candidateLanguageUpdateSchema = Joi.object({
  level: Joi.string().valid( 'BASIC', 'FLUENT', 'NATIVE').required()
});



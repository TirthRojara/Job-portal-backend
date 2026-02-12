import Joi from 'joi';

export const candidateProfile_Create_Schema = Joi.object({
    fullName: Joi.string().required(),
    gender: Joi.string().required(),
    summary: Joi.string().required(),
    phone: Joi.string().required(),
    // cv: Joi.string().required(),
    birthDate: Joi.date().required(),
    address: Joi.string().required(),
    openToWork: Joi.boolean().optional()
});

export const candidateProfile_Update_Schema = Joi.object({
    fullName: Joi.string().optional(),
    gender: Joi.string().optional(),
    summary: Joi.string().optional(),
    phone: Joi.string().optional(),
    cv: Joi.string().optional(),
    birthDate: Joi.date().optional(),
    address: Joi.string().optional(),
    openToWork: Joi.boolean().optional()
});

export const viewResume = Joi.object({
    companyId: Joi.number().required()
});

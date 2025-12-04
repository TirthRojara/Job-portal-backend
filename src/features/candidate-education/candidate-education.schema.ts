import Joi from 'joi';

export const candidateEducationCreateSchema = Joi.object({
    educationId: Joi.number().required(),
    major: Joi.string().required(),
    degree: Joi.string().valid('BACHELOR', 'MASTER', 'PHD').required(),
    yearStart: Joi.number().integer().min(1000).max(9999).required().messages({
        'number.base': 'yearEnd must be in YYYY format',
        'number.integer': 'yearEnd must be in YYYY format',
        'number.min': 'yearEnd must be in YYYY format',
        'number.max': 'yearEnd must be in YYYY format',
        'any.required': 'yearEnd is required'
    }),
    yearEnd: Joi.number().integer().min(1000).max(9999).required().messages({
        'number.base': 'yearEnd must be in YYYY format',
        'number.integer': 'yearEnd must be in YYYY format',
        'number.min': 'yearEnd must be in YYYY format',
        'number.max': 'yearEnd must be in YYYY format',
        'any.required': 'yearEnd is required'
    })
});

export const candidateEducationUpdateSchema = Joi.object({
    educationId: Joi.number().optional(),
    major: Joi.string().optional(),
    degree: Joi.string().valid('BACHELOR', 'MASTER', 'PHD').optional(),
    yearStart: Joi.number().integer().min(1000).max(9999).optional().messages({
        'number.base': 'yearEnd must be in YYYY format',
        'number.integer': 'yearEnd must be in YYYY format',
        'number.min': 'yearEnd must be in YYYY format',
        'number.max': 'yearEnd must be in YYYY format',
        'any.required': 'yearEnd is required'
    }),
    yearEnd: Joi.number().integer().min(1000).max(9999).optional().messages({
        'number.base': 'yearEnd must be in YYYY format',
        'number.integer': 'yearEnd must be in YYYY format',
        'number.min': 'yearEnd must be in YYYY format',
        'number.max': 'yearEnd must be in YYYY format',
        'any.required': 'yearEnd is required'
    })
});

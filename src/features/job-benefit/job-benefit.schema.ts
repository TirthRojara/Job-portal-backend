import Joi from "joi";

export const jobBenefitSchema = Joi.object({
    benefitName: Joi.string().required()
})
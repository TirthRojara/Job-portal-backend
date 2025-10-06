import Joi from "joi";

export const jobRoleCreateSchema = Joi.object({
    name: Joi.string().required()
})
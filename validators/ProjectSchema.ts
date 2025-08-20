import Joi, { ObjectSchema } from 'joi';

const createProjectSchema = Joi.object({
    name: Joi.string().min(1).required(),
    description: Joi.string().allow('').optional(),
    ownerId: Joi.string().uuid().required(),
});

const listProjectsSchema = Joi.object({
    q: Joi.string().allow('').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
});

export { createProjectSchema, listProjectsSchema };
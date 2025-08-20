import Joi, { ObjectSchema } from 'joi';

const usersPostSchema = Joi.object({
    name: Joi.string().alphanum().min(1).required(),
    surname: Joi.string().alphanum().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    meta: Joi.any().optional()
});

const usersUpdateSchema = Joi.object({
    name: Joi.string().alphanum().min(1),
    surname: Joi.string().alphanum().min(1),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    meta: Joi.any().optional()
}).min(1);

export {
    usersPostSchema,
    usersUpdateSchema,
};
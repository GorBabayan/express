import Joi, { ObjectSchema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import StatusCodes from 'http-status-codes';

const usersPostSchema = Joi.object({
    name: Joi.string().alphanum().min(1).required(),
    surname: Joi.string().alphanum().min(1).required(),
    email: Joi.string().email().required(),
    meta: Joi.any().optional()
});

const usersUpdateSchema = Joi.object({
    name: Joi.string().alphanum().min(1),
    surname: Joi.string().alphanum().min(1),
    email: Joi.string().email(),
    meta: Joi.any().optional()
}).min(1);

const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
    if (!schema) {
        return next();
    }

    const options: object = {
        abortEarly: false,
        stripUnknown: true,
        errors: {
            wrap: {
                label: false
            }
        }
    };

    const { error, value } = schema.validate(req.body, options);

    if (!error) {
        req.body = value;
        return next();
    }

    const errorDetails = error.details.map(detail => ({
        path: detail.path.join('.'),
        message: detail.message
    }));

    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation error',
      errors: errorDetails
    });
}

export {
    usersPostSchema,
    usersUpdateSchema, 
    validate
};
import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import StatusCodes from 'http-status-codes';


export const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
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


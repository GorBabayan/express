const Joi = require('joi');
const StatusCodes = require('http-status-codes');

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

const validate = (schema) => (req, res, next) => {
    if (!schema) {
        return next();
    }

    const options = {
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
        next();
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

module.exports = {
    usersPostSchema,
    usersUpdateSchema, 
    validate
};
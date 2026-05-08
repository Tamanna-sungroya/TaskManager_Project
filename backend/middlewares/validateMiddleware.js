const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.details.map((d) => d.message),
        });
    }

    req.body = value;
    next();
};

const authSchemas = {
    register: Joi.object({
        name: Joi.string().min(2).max(80).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(128).required(),
        profileImageUrl: Joi.string().allow("", null),
        adminInviteToken: Joi.string().allow("", null),
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(128).required(),
    }),
};

module.exports = { validate, authSchemas };

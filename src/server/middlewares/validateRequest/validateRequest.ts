import { RequestHandler } from "express";
import * as Joi from "@hapi/joi";
import { ServiceError } from "../../errors";
import { BAD_REQUEST } from "http-status-codes";

interface ValidationSchema {
    body?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
}

export const validateRequest = (
    validationSchema: ValidationSchema,
    options?: Joi.ValidationOptions
): RequestHandler => (req, res, next): void => {
    const { error } = Joi.object(validationSchema).validate(
        {
            ...(validationSchema.body && { body: req.body }),
            ...(validationSchema.params && { params: req.params }),
            ...(validationSchema.query && { query: req.query })
        },
        {
            presence: "required",
            ...options
        }
    );

    next(
        error
            ? new ServiceError(error.message, { title: "Invalid Request", statusCode: BAD_REQUEST })
            : undefined
    );
};

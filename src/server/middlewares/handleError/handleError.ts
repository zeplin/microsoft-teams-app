import { ErrorRequestHandler } from "express";
import { logger } from "../../adapters/logger";
import { ServerError } from "../../errors";

export const handleError: ErrorRequestHandler = (error, req, res, next) => {
    const serverError = error instanceof ServerError ? error : ServerError.fromError(error);
    if (!res.headersSent) {
        res.status(serverError.statusCode).json({
            detail: error.message,
            title: error?.title ?? "Unexpected Error"
        });
        logger.error(serverError);
    }
    next();
};

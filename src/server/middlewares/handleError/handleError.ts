import { ErrorRequestHandler } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";

export const handleError: ErrorRequestHandler = (err, req, res, next) => {
    if (!res.headersSent) {
        res.status(err?.statusCode ?? INTERNAL_SERVER_ERROR).json({ errors: [{
            detail: err?.message ?? "Unexpected Error",
            title: err?.title ?? "Unexpected Error"
        }] });
    }
    next(err);
};

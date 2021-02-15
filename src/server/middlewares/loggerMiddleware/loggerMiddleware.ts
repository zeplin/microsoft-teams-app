import { RequestHandler, Request, Response } from "express";
import { logger } from "../../adapters/logger";

function formatRequest(req: Request): unknown {
    return {
        ip: req.ip,
        headers: {
            ...req.headers,
            ...(req.headers.authorization ? { authorization: "[REDACTED]" } : undefined)
        },
        baseUrl: req.baseUrl,
        body: req.body,
        cookies: req.cookies,
        fresh: req.fresh,
        hostname: req.hostname,
        method: req.method,
        originalUrl: req.originalUrl,
        params: req.params,
        path: req.path,
        protocol: req.protocol,
        query: req.query,
        secure: req.secure
    };
}

function formatResponse(res: Response): unknown {
    return {
        statusCode: res.statusCode
    };
}

export const loggerMiddleware: RequestHandler = (req, res, next) => {
    next();
    logger.info(
        `${req.method} - ${req.originalUrl}`,
        {
            meta: {
                req: formatRequest(req),
                res: formatResponse(res)
            }
        }
    );
};

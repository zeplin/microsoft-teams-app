import { RequestHandler, Request, Response } from "express";
import { logger, loggerContext } from "../../adapters";

import crypto from "crypto";

const ID_BYTE_SIZE = 16;
function getCorrelationIdFromRequest(req: Request): string {
    return req.headers["zeplin-correlation-id"] as string ?? crypto.randomBytes(ID_BYTE_SIZE).toString("hex");
}

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

export const loggerMiddleware: RequestHandler = (req, res, next) => (
    loggerContext.run(
        { correlationId: getCorrelationIdFromRequest(req) },
        () => {
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
        }
    )
);

import { RequestHandler } from "express";
import bodyParser from "body-parser";
import { BAD_REQUEST } from "http-status-codes";
import { ServiceError } from "../../errors";

const jsonBodyParser = bodyParser.json({ limit: "5mb" });

const jsonBodyParserHandler: RequestHandler = (req, res, next) => {
    jsonBodyParser(req, res, err => {
        if (err) {
            next(new ServiceError(err.message, { statusCode: BAD_REQUEST, title: "Invalid Content Type" }));
        } else {
            next();
        }
    });
};

const createContentTypeError = (contentType?: string): ServiceError => {
    const message = contentType ? `Content type ${contentType} is not supported` : "Content type is required";
    return new ServiceError(message, { statusCode: BAD_REQUEST, title: "Invalid Content Type" });
};

export const JSONBodyParser: RequestHandler = (req, res, next) => {
    if (req.is("application/json")) {
        jsonBodyParserHandler(req, res, next);
    } else {
        next(createContentTypeError(req.get("Content-Type")));
    }
};


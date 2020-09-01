import { INTERNAL_SERVER_ERROR } from "http-status-codes";

interface ServiceErrorOptions {
    statusCode?: number;
    title?: string;
    extra?: object;
}

export class ServiceError extends Error {
    statusCode: number;
    title?: string;
    extra?: object;

    constructor(
        message: string,
        { statusCode, title, extra }: ServiceErrorOptions = {}
    ) {
        super(message);
        this.statusCode = statusCode || INTERNAL_SERVER_ERROR;
        this.title = title;
        this.extra = extra;
    }
}

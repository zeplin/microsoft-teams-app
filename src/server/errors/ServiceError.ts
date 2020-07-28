import { INTERNAL_SERVER_ERROR } from "http-status-codes";

interface ServiceErrorOptions {
    statusCode?: number;
    title?: string;
}

export class ServiceError extends Error {
    statusCode: number;
    title?: string;

    constructor(
        message: string,
        { statusCode, title }: ServiceErrorOptions = {}
    ) {
        super(message);
        this.statusCode = statusCode || INTERNAL_SERVER_ERROR;
        this.title = title;
    }
}

import { INTERNAL_SERVER_ERROR } from "http-status-codes";

interface ZeplinErrorOptions {
    statusCode?: number;
}

export class ZeplinError extends Error {
    statusCode: number;
    message: string;

    constructor(
        message: string,
        { statusCode }: ZeplinErrorOptions = {}
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode || INTERNAL_SERVER_ERROR;
    }
}

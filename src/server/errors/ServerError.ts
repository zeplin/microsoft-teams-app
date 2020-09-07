import { INTERNAL_SERVER_ERROR } from "http-status-codes";

interface ServerErrorOptions {
    statusCode?: number;
    title?: string;
    extra?: object;
    shouldCapture?: boolean;
}

export class ServerError extends Error {
    statusCode: number;
    title?: string;
    extra?: object;
    shouldCapture: boolean;

    constructor(
        message: string,
        {
            statusCode,
            title,
            extra,
            shouldCapture = true
        }: ServerErrorOptions = {}
    ) {
        super(message);
        this.statusCode = statusCode || INTERNAL_SERVER_ERROR;
        this.title = title;
        this.extra = extra;
        this.shouldCapture = shouldCapture;
    }
}

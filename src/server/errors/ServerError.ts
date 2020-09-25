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
            statusCode = INTERNAL_SERVER_ERROR,
            title,
            extra,
            shouldCapture = statusCode >= INTERNAL_SERVER_ERROR
        }: ServerErrorOptions = {}
    ) {
        super(message);
        this.statusCode = statusCode;
        this.title = title;
        this.extra = extra;
        this.shouldCapture = shouldCapture;
    }
}

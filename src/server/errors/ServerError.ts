import { INTERNAL_SERVER_ERROR } from "http-status-codes";

interface ServerErrorOptions {
    statusCode?: number;
    title?: string;
    extra?: object;
    shouldCapture?: boolean;
}

interface ErrorMeta {
    stack: string;
    statusCode: number;
    errorTitle?: string;
    extra?: object;
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

    toMeta(): ErrorMeta {
        return {
            stack: this.stack ?? "No stack trace found",
            statusCode: this.statusCode,
            errorTitle: this.title,
            extra: this.extra
        };
    }

    static fromError(error: Error): ServerError {
        const result = new ServerError(error.message);
        result.stack = error.stack;
        return result;
    }

    static fromUnknown(error: unknown): ServerError {
        if (error instanceof ServerError) {
            return error;
        }
        if (error instanceof Error) {
            return ServerError.fromError(error);
        }
        return new ServerError(`Unknown error: ${error}`);
    }
}

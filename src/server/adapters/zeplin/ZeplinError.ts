interface ZeplinErrorOptions {
    statusCode?: number;
}

export class ZeplinError extends Error {
    statusCode?: number;
    message: string;

    constructor(
        message: string,
        { statusCode }: ZeplinErrorOptions = {}
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}

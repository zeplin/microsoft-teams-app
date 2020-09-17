export class ClientError extends Error {
    constructor(
        message: string,
        public title: string,
        public status: number
    ) {
        super(message);
    }
}

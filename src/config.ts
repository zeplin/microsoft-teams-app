/* eslint-disable no-process-env */
type Config = {
    BASE_URL: string;
    APPLICATION_ID: string;
    PORT: number;
}

const DEFAULT_PORT = 3000;

export function getConfig(): Config {
    const {
        NEXT_PRIVATE_APPLICATION_ID: APPLICATION_ID,
        NEXT_PUBLIC_BASE_URL: BASE_URL
    } = process.env;

    return {
        PORT: process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT,
        APPLICATION_ID,
        BASE_URL
    };
}

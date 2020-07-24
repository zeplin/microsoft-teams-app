/* eslint-disable no-process-env */

// This is a workaround for enabling config variables in server side before the NextJS app is initialized
// However, we don't want to run `dotenv` in client side since it is not meaningful and erroneous
// NextJS itself enables environment variable usage in client side
if (typeof window === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { config } = require("dotenv");
    // eslint-disable-next-line no-process-env
    config({ path: process.env.ENV_FILE });
}

function getNumberVar(name: string, defaultValue: number): number {
    const variable = process.env[name];
    if (Number.isFinite(Number(variable))) {
        return Number(variable);
    }

    return defaultValue;
}

const DEFAULT_PORT = 3000;

export const PORT = getNumberVar("PORT", DEFAULT_PORT);
export const {
    NODE_ENV: ENVIRONMENT,
    REDIS_URL = "redis://localhost:6379",
    NEXT_PUBLIC_BASE_URL: BASE_URL
} = process.env;
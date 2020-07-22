/* eslint-disable no-process-env */
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
    NEXT_PRIVATE_APPLICATION_ID: APPLICATION_ID,
    NODE_ENV: ENVIRONMENT,
    NEXT_PUBLIC_BASE_URL: BASE_URL
} = process.env;
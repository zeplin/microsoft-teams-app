/* eslint-disable no-process-env */
import { config } from "dotenv";
import { ServerError } from "./errors";

config({ path: process.env.ENV_FILE });

function getNumberVariable(name: string, defaultValue: number): number {
    const variable = process.env[name];
    if (Number.isFinite(Number(variable))) {
        return Number(variable);
    }

    return defaultValue;
}

function getBooleanVariable(name: string, defaultValue: boolean): boolean {
    const variable = process.env[name];
    return variable
        ? variable.toLowerCase() === "true"
        : defaultValue;
}

const DEFAULT_PORT = 3000;

export const PORT = getNumberVariable("NEXT_PUBLIC_PORT", DEFAULT_PORT);
export const {
    NEXT_PUBLIC_ENVIRONMENT: ENVIRONMENT = "local",
    NEXT_PUBLIC_VERSION: VERSION = "1.0.0-local",
    NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
    NEXT_PRIVATE_REDIS_URL: REDIS_URL = "redis://localhost:6379",
    NEXT_PRIVATE_WEBHOOK_SECRET: WEBHOOK_SECRET = "dummy-secret",
    NEXT_PRIVATE_ZEPLIN_URL: ZEPLIN_URL = "https://api.zeplin.dev",
    NEXT_PRIVATE_ZEPLIN_CLIENT_ID: ZEPLIN_CLIENT_ID,
    NEXT_PRIVATE_ZEPLIN_CLIENT_SECRET: ZEPLIN_CLIENT_SECRET,
    NEXT_PRIVATE_MONGO_URL: MONGO_URL = "mongodb://localhost:27017/zeplin-microsoft-teams-app",
    NEXT_PUBLIC_BASE_URL: BASE_URL,
    NEXT_PRIVATE_ZEPLIN_WEB_APP_BASE_URL: ZEPLIN_WEB_APP_BASE_URL = "https://app.zeplin.io",
    NEXT_PRIVATE_ZEPLIN_MAC_APP_URL_SCHEME: ZEPLIN_MAC_APP_URL_SCHEME = "zpl"
} = process.env;

export const IS_DEV = process.env.NODE_ENV !== "production";
export const IS_MONGO_DEBUG = getBooleanVariable("NEXT_PRIVATE_IS_MONGO_DEBUG", IS_DEV);
export const IS_SENTRY_ENABLED = getBooleanVariable("NEXT_PUBLIC_IS_SENTRY_ENABLED", !IS_DEV);

export interface Config {
    IS_MONGO_DEBUG: boolean;
    MONGO_URL: string;
    ENVIRONMENT: string;
    REDIS_URL: string;
    BASE_URL: string;
    PORT: number;
    IS_DEV: boolean;
    WEBHOOK_SECRET: string;
    ZEPLIN_URL: string;
    SENTRY_DSN: string;
    IS_SENTRY_ENABLED: boolean;
    VERSION: string;
    ZEPLIN_CLIENT_ID: string;
    ZEPLIN_CLIENT_SECRET: string;
}

export function validateConfig(value: Partial<Config>): value is Config {
    if (value.BASE_URL === undefined) {
        throw new ServerError("`BASE_URL` is missing");
    }
    if (value.ZEPLIN_CLIENT_ID === undefined) {
        throw new ServerError("`ZEPLIN_CLIENT_ID` is missing");
    }
    if (value.ZEPLIN_CLIENT_SECRET === undefined) {
        throw new ServerError("`ZEPLIN_CLIENT_SECRET` is missing");
    }

    return true;
}

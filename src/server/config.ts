/* eslint-disable no-process-env */
import { config } from "dotenv";

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
    NODE_ENV: ENVIRONMENT,
    NEXT_PRIVATE_REDIS_URL: REDIS_URL = "redis://localhost:6379",
    NEXT_PRIVATE_WEBHOOK_SECRET: WEBHOOK_SECRET = "dummy-secret",
    NEXT_PRIVATE_ZEPLIN_URL: ZEPLIN_URL = "https://api.zeplin.dev",
    NEXT_PRIVATE_MONGO_URL: MONGO_URL = "mongodb://localhost:27017/zeplin-msteams-app",
    NEXT_PUBLIC_BASE_URL: BASE_URL
} = process.env;

export const IS_DEV = ENVIRONMENT !== "production";
export const IS_MONGO_DEBUG = getBooleanVariable("NEXT_PRIVATE_IS_MONGO_DEBUG", IS_DEV);

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
}
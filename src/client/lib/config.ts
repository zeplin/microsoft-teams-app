/* eslint-disable no-process-env, prefer-destructuring */
export const NODE_ENV = process.env.NODE_ENV;
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
export const VERSION = process.env.NEXT_PUBLIC_VERSION;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
export const IS_SENTRY_ENABLED = process.env.NEXT_PUBLIC_IS_SENTRY_ENABLED
    ? process.env.NEXT_PUBLIC_IS_SENTRY_ENABLED.toLowerCase() === "true"
    : NODE_ENV === "production";
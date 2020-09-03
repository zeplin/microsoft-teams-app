/* eslint-disable no-process-env */
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
export const VERSION = process.env.NEXT_PUBLIC_VERSION;
export const ENVIRONMENT = process.env.NODE_ENV;
export const IS_SENTRY_ENABLED = process.env.NEXT_PUBLIC_IS_SENTRY_ENABLED
    ? process.env.NEXT_PUBLIC_IS_SENTRY_ENABLED.toLowerCase() === "true"
    : ENVIRONMENT === "production";
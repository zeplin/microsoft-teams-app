/* eslint-disable no-process-env, prefer-destructuring */
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
export const VERSION = process.env.NEXT_PUBLIC_VERSION;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
export const IS_DEV = process.env.NODE_ENV !== "production";
export const IS_SENTRY_ENABLED = process.env.NEXT_PUBLIC_IS_SENTRY_ENABLED
    ? process.env.NEXT_PUBLIC_IS_SENTRY_ENABLED.toLowerCase() === "true"
    : !IS_DEV;
export const ZEPLIN_WEB_APP_BASE_URL = process.env.NEXT_PUBLIC_ZEPLIN_WEB_APP_BASE_URL ??
    "https://app.zeplin.io";
export const ZEPLIN_APP_URI_SCHEME = process.env.NEXT_PUBLIC_ZEPLIN_APP_URI_SCHEME ?? "zpl";
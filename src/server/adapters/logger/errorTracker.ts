import chalk from "chalk";
import {
    init,
    captureException,
    withScope,
    flush
} from "@sentry/node";

import { ServerError } from "../../errors";
import { LoggerContext } from "../context";
/* eslint-disable no-console */
const INDENT = 2;

const SENTRY_HTTP_BREADCRUMB = "http";
const SENTRY_BREADCRUMB_BLACKLIST_PATTERN = /collector.*newrelic.com/i;

interface Extra {
    meta?: object;
    context?: LoggerContext;
}

interface SentryGetParams {
    sentryDSN: string;
    environment: string;
    version: string;
}

interface ErrorTracker {
    captureError: (error: ServerError, extra: Extra) => void;
    flush: () => Promise<void> ;
}

const getSentry = ({ sentryDSN, environment, version }: SentryGetParams): ErrorTracker => {
    init({
        dsn: sentryDSN,
        environment,
        release: version,
        normalizeDepth: 20,
        beforeBreadcrumb(breadcrumb) {
            const shouldIgnoreBreadcrumb = (
                breadcrumb.type === SENTRY_HTTP_BREADCRUMB &&
                SENTRY_BREADCRUMB_BLACKLIST_PATTERN.test(breadcrumb.data?.url)
            );

            return shouldIgnoreBreadcrumb ? null : breadcrumb;
        },
        beforeSend(event) {
            if (event.request?.headers?.authorization) {
                event.request.headers.authorization = "[REDACTED]";
            }
            if (event.request?.data?.accessToken) {
                event.request.data.accessToken = "[REDACTED]";
            }
            if (event.request?.data?.refreshToken) {
                event.request.data.refreshToken = "[REDACTED]";
            }
            return event;
        }
    });
    return {
        captureError: (error, { meta, context }): void => {
            withScope(scope => {
                if (meta) {
                    scope.setContext("Meta", meta);
                }

                if (context) {
                    scope.setContext("Context", context);
                }

                if (context?.correlationId) {
                    scope.setTag("correlationId", context.correlationId);
                }

                captureException(error);
            });
        },
        flush: async (): Promise<void> => {
            await flush();
        }
    };
};

const getConsoleTracker = (): ErrorTracker => ({
    captureError: (error, { meta }): void => {
        console.log(chalk`[{bgRed ERROR_TRACKER}]: ${error.message}`);
        if (meta && Object.keys(meta).length > 0) {
            console.log(JSON.stringify({ meta }, null, INDENT));
        }
    },
    flush: (): Promise<void> => Promise.resolve()
});

interface ErrorTrackerGetParams {
    sentryDSN?: string;
    environment: string;
    version: string;
}

const getErrorTracker = ({ sentryDSN, environment, version }: ErrorTrackerGetParams): ErrorTracker => (
    sentryDSN === undefined
        ? getConsoleTracker()
        : getSentry({ sentryDSN, environment, version })
);

export {
    getErrorTracker,
    ErrorTracker
};

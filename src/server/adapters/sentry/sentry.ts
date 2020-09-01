import * as SentryClient from "@sentry/node";
import { RequestHandler, ErrorRequestHandler } from "express";
import { ServiceError } from "../../errors";

type SentryInitParams = {
    sentryDsn: string;
    version: string;
    environment: string;
}

class Sentry {
    init({ sentryDsn, version, environment }: SentryInitParams): void {
        SentryClient.init({
            dsn: sentryDsn,
            release: version,
            environment,
            beforeSend(event) {
                if (event.request) {
                    delete event.request.headers?.["authorization"];

                    if (event.request.data && typeof event.request.data === "object") {
                        delete event.request.data.accessToken;
                        delete event.request.data.refreshToken;
                    }
                }

                return event;
            }
        });
    }

    captureException(error: Error): void {
        if (error instanceof ServiceError && error.extra) {
            SentryClient.withScope(scope => {
                scope.setExtra("extra", error.extra);
                SentryClient.captureException(error);
            });
            return;
        }

        SentryClient.captureException(error);
    }

    get requestHandler(): RequestHandler {
        return SentryClient.Handlers.requestHandler();
    }

    get errorHandler(): ErrorRequestHandler {
        const sentryErrorHandler = SentryClient.Handlers.errorHandler({
            shouldHandleError: (error: Error) => {
                if (error instanceof ServiceError) {
                    return error.shouldCapture;
                }

                return true;
            }
        });

        return (error, req, res, next): void => {
            if (error instanceof ServiceError && error.extra) {
                SentryClient.configureScope(scope => {
                    scope.setExtra("extra", error.extra);
                });
            }

            return sentryErrorHandler(error, req, res, next);
        };
    }
}

export const sentry = new Sentry();
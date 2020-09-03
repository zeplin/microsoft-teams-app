import * as SentryClient from "@sentry/node";
import { RequestHandler, ErrorRequestHandler } from "express";
import { ServerError } from "../../errors";

type SentryInitParams = {
    dsn: string;
    enabled: boolean;
    version: string;
    environment: string;
}

class Sentry {
    init({
        dsn,
        version,
        environment,
        enabled
    }: SentryInitParams): void {
        SentryClient.init({
            enabled,
            dsn,
            release: version,
            environment,
            beforeSend(event) {
                if (event.request) {
                    delete event.request.headers?.["authorization"];

                    if (
                        event.request.data &&
                        typeof event.request.data === "object"
                    ) {
                        delete event.request.data.accessToken;
                        delete event.request.data.refreshToken;
                    }
                }

                return event;
            }
        });
    }

    captureException(error: Error): void {
        if (error instanceof ServerError && error.extra) {
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
                if (error instanceof ServerError) {
                    return error.shouldCapture;
                }

                return true;
            }
        });

        return (error, req, res, next): void => {
            if (error instanceof ServerError && error.extra) {
                SentryClient.configureScope(scope => {
                    scope.setExtra("extra", error.extra);
                });
            }

            return sentryErrorHandler(error, req, res, next);
        };
    }
}

export const sentry = new Sentry();
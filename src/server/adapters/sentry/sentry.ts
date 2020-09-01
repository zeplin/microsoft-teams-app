import * as SentryClient from "@sentry/node";
import { RequestHandler, ErrorRequestHandler } from "express";

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

    get requestHandler(): RequestHandler {
        return SentryClient.Handlers.requestHandler();
    }

    get errorHandler(): ErrorRequestHandler {
        return SentryClient.Handlers.errorHandler();
    }
}

export const sentry = new Sentry();